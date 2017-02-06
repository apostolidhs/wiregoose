/* jshint esversion:6, node:true  */

'use strict';

let $$supertest;
let $$app;
let $$krkDbMongooseConnector;
let $$config;
let $$krkModelsUser;
let expect;

KlarkModule(module, 'routesAuthorizeTest', ($supertest, $chai, krkDbMongooseConnector, krkModelsUser, config, app) => {
  $$supertest = $supertest;
  $$app = app.create();
  expect = $chai.expect;
  $$krkDbMongooseConnector = krkDbMongooseConnector;
  $$config = config;
  $$krkModelsUser = krkModelsUser;
});

describe('routesAuthorize', function() {
  const initDb = done => {
    $$krkDbMongooseConnector.connect($$config.MONGODB_URL)
      .then(() => $$krkDbMongooseConnector.dropDatabase())
      .then(() => done());
  };
  before(initDb);
  after(initDb);

  const userCredential = {
    email: 'test@test.test',
    password: '111',
    name: 'test'
  };

  let user;
  let jwtToken;

  it('Should sign up a user', done => {

    $$supertest($$app)
      .post(`/${$$config.API_URL_PREFIX}/authorize/signup`)
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

  it('Should not allow to login if user does not validate', done => {
    $$supertest($$app)
      .post(`/${$$config.API_URL_PREFIX}/authorize/login`)
      .send(userCredential)
      .set('Accept', 'application/json')
      .expect(400)
      .expect(res => {
          expect(res.body.errors.length).to.equal(1);
          expect(res.body.errors[0].code).to.equal(4002);
      })
      .end(done);
  }).timeout(5000);

  it('Should validate the user correctly', done => {
   $$krkModelsUser.findOne({_id: user._id})
      .then((user) => {
        $$supertest($$app)
          .get(`/${$$config.API_URL_PREFIX}/authorize/verifyAccount?token=${user.validationToken}`)
          .set('Accept', 'application/json')
          .expect(302)
          .end(done);
      });
  }).timeout(5000);

  it('Should allow to login if user is validated', done => {
    $$supertest($$app)
      .post(`/${$$config.API_URL_PREFIX}/authorize/login`)
      .send(userCredential)
      .set('Accept', 'application/json')
      .expect(200)
      .expect(res => {
          jwtToken = res.body.data;
          expect(!!jwtToken).to.equal(true);
      })
      .end(done);
  }).timeout(5000);

});
