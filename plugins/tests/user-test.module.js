'use strict';

let $supertest;
let app;
let expect;
let _;
let config;
let testsPrepareDb;
let krkGeneratorsCreateUser;

KlarkModule(module, 'testsUser', (_$supertest_, $chai, ___, _app_, _config_, _testsPrepareDb_, _krkGeneratorsCreateUser_) => {
  $supertest = _$supertest_;
  app = _app_.create();
  _ = ___;
  expect = $chai.expect;
  config = _config_;
  testsPrepareDb = _testsPrepareDb_;
  krkGeneratorsCreateUser = _krkGeneratorsCreateUser_;
});

describe('routesAuthorize', function() {

  let adminPallet;
  let user1Pallet;
  let user2Pallet;
  const user1 = {
    name: 'name1',
    email: 'email1@gmail.com',
    password: 'password1'
  };
  const user2 = {
    name: 'name2',
    email: 'email2@gmail.com',
    password: 'password2'
  };
  before(() => testsPrepareDb.connectWithAdmin(true)
                .then(pallet => adminPallet = pallet)
                .then(() => krkGeneratorsCreateUser.simple(user1))
                .then(user => testsPrepareDb.connectWithUser(false, user))
                .then(pallet => user1Pallet = pallet)
                .then(() => krkGeneratorsCreateUser.simple(user2))
                .then(user => testsPrepareDb.connectWithUser(false, user))
                .then(pallet => user2Pallet = pallet)
  );

  it('Should get the user', done => {
    $supertest(app)
      .get(`/${config.API_URL_PREFIX}/user/${user1Pallet.user._id}`)
      .set('Accept', 'application/json')
      .set('authorization', adminPallet.token)
      .expect(200)
      .expect(res => {
        expect(res.body.data.email).to.equal(user1Pallet.user.email);
      })
      .end(done);
  }).timeout(5000);

  it('Admin should change user\'s phone number', done => {
    const phone = '1234';
    $supertest(app)
      .patch(`/${config.API_URL_PREFIX}/user/${user1Pallet.user._id}`)
      .set('Accept', 'application/json')
      .send({ phone })
      .set('authorization', adminPallet.token)
      .expect(200)
      .expect(res => {
        expect(res.body.data.phone).to.equal(phone);
      })
      .end(done);
  }).timeout(5000);

  it('User should change his phone number', done => {
    const phone = '123';
    $supertest(app)
      .patch(`/${config.API_URL_PREFIX}/user/${user1Pallet.user._id}`)
      .set('Accept', 'application/json')
      .send({ phone })
      .set('authorization', user1Pallet.token)
      .expect(200)
      .expect(res => {
        expect(res.body.data.phone).to.equal(phone);
      })
      .end(done);
  }).timeout(5000);

  it('User should not be able to change onother\'s user phone number', done => {
    const phone = '123';
    $supertest(app)
      .patch(`/${config.API_URL_PREFIX}/user/${user2Pallet.user._id}`)
      .set('Accept', 'application/json')
      .send({ phone })
      .set('authorization', user1Pallet.token)
      .expect(401)
      .expect(res => {
        expect(res.body.errors.length).to.equal(1);
        expect(res.body.errors[0].code).to.equal(4001);
      })
      .end(done);
  }).timeout(5000);

  it('User should change all', done => {
    const phone = '123';
    const newPassword = '123456';
    const name = 'asdasd';
    $supertest(app)
      .patch(`/${config.API_URL_PREFIX}/user/${user1Pallet.user._id}`)
      .set('Accept', 'application/json')
      .send({ phone, newPassword, oldPassword: user1.password, name })
      .set('authorization', user1Pallet.token)
      .expect(200)
      .expect(res => {
        expect(res.body.data.phone).to.equal(phone);
        expect(res.body.data.name).to.equal(name);
      })
      .end(done);
  }).timeout(5000);

});