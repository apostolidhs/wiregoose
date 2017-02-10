/* jshint esversion:6, node:true  */

'use strict';

let $supertest;
let app;
let config;
let krkModelsUser;
let expect;
let testsPrepareDb;
let _;

KlarkModule(module, 'routesAuthorizeTest', (
  ___,
  _$supertest_,
  $chai,
  _testsPrepareDb_,
  _krkModelsUser_,
  _config_,
  _app_
) => {
  $supertest = _$supertest_;
  app = _app_.create();
  expect = $chai.expect;
  _ = ___;
  config = _config_;
  krkModelsUser = _krkModelsUser_;
  testsPrepareDb = _testsPrepareDb_;
});

describe('routesAuthorize', function() {

  before(() => testsPrepareDb.connect());

  const userCredential = {
    email: 'test@test.test',
    password: '111',
    name: 'test'
  };

  let user;
  let jwtToken;

  it('Should sign up a user', done => {
    $supertest(app)
      .post(`/${config.API_URL_PREFIX}/authorize/signup`)
      .send(userCredential)
      .set('Accept', 'application/json')
      .expect(200)
      .expect(res => {
        user = res.body.data;
        expect(user.email).to.equal(userCredential.email);
        expect(!!user.validationToken).to.equal(false);
      })
      .end(done);
  }).timeout(5000);

  it('Should not allow email duplications on sign up', done => {
    const invalidUser = _.cloneDeep(userCredential);
    invalidUser.name = invalidUser.name + 'a';
    setTimeout(() =>
      $supertest(app)
        .post(`/${config.API_URL_PREFIX}/authorize/signup`)
        .send(invalidUser)
        .set('Accept', 'application/json')
        .expect(400)
        .expect(res => {
          expect(res.body.errors.length).to.equal(1);
          expect(res.body.errors[0].code).to.equal(4003);
        })
        .end(done), 1000);
  }).timeout(5000);

  it('Should not allow to login on invalid credentials', done => {
    const invalidUser = _.cloneDeep(userCredential);
    invalidUser.password = invalidUser.password + 'a';
    $supertest(app)
      .post(`/${config.API_URL_PREFIX}/authorize/login`)
      .send(invalidUser)
      .set('Accept', 'application/json')
      .expect(401)
      .expect(res => {
        expect(res.body.errors.length).to.equal(1);
        expect(res.body.errors[0].code).to.equal(4001);
      })
      .end(done);
  }).timeout(5000);

  it('Should validate the user email/account correctly', done => {
   krkModelsUser.findOne({_id: user._id})
    .then((user) => {
      $supertest(app)
        .get(`/${config.API_URL_PREFIX}/authorize/verifyAccount?token=${user.validationToken}`)
        .set('Accept', 'application/json')
        .expect(302)
        .end(done);
    });
  }).timeout(5000);

  it('Should login', done => {
    $supertest(app)
      .post(`/${config.API_URL_PREFIX}/authorize/login`)
      .send(userCredential)
      .set('Accept', 'application/json')
      .expect(200)
      .expect(res => {
        jwtToken = res.body.data;
        expect(!!jwtToken).to.equal(true);
      })
      .end(done);
  }).timeout(5000);

  it('Should refresh the jwt token', done => {
    $supertest(app)
      .post(`/${config.API_URL_PREFIX}/authorize/refreshToken`)
      .set('Accept', 'application/json')
      .set('authorization', jwtToken)
      .expect(200)
      .expect(res => {
        const newJwtToken = res.body.data;
        expect(!!newJwtToken).to.equal(true);
        expect(newJwtToken).to.not.equal(jwtToken);
      })
      .end(done);
  }).timeout(5000);

});
