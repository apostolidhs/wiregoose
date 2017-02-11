/* jshint esversion:6, node:true  */

'use strict';

let $supertest;
let app;
let expect;
let should;
let _;
let config;
let testsPrepareDb;

KlarkModule(module, 'testReferenceCrud', (_$supertest_, $chai, ___, _app_, _config_, _testsPrepareDb_) => {
  $supertest = _$supertest_;
  app = _app_.create();
  _ = ___;
  expect = $chai.expect;
  should = $chai.should();
  config = _config_;
  testsPrepareDb = _testsPrepareDb_;
});

describe('Testing the CRUD functionality of a referenced model', () => {

  let jwtToken;

  before(function() {
    this.timeout(5000);
    return testsPrepareDb.connectWithAdmin(true)
      .then(pallet => jwtToken = pallet.token);
  });

  const category = {
    name: 'Tech'
  };

  const provider = {
    name: 'BBC',
    link: 'http://www.bbc.com'
  };

  const rssRegistration = {
    category: undefined, // id after creation
    link: 'http://www.bbc.com/mock',
    lang: 'gr',
    provider: undefined // id after creation
  };

  let newCategory;
  let newProvider;
  let newRssRegistration;

  it('Should create invalid referenced record', (done) => {
    // random mongo ids
    rssRegistration.category = '580a2b318160d8a73b4c0b36';
    rssRegistration.provider = '580a2b318160d8a73b4c0b36';

    $supertest(app)
      .post('/' + config.API_URL_PREFIX + '/rssRegistration')
      .send({
        RssRegistration: rssRegistration
      })
      .set('authorization', jwtToken)
      .set('Accept', 'application/json')
      .expect(400)
      .expect(res => {
          expect(res.body.errors.length).to.equal(1);
          res.body.errors[0].msg.should.have.property('category');
          res.body.errors[0].msg.should.have.property('provider');
      })
      .end(done);
  });

  it('Should create 2 records and attach them on one referenced record', (done) => {
    createCategory(() => {
      createProvider(() => {
        createRssRegistration(done);
      });
    });
  });

  it('Should update invalid referenced record', (done) => {
    // random mongo ids
    rssRegistration.category = '580a2b318160d8a73b4c0b36';

    $supertest(app)
      .put('/' + config.API_URL_PREFIX + '/rssRegistration/' + newRssRegistration._id)
      .send({
        RssRegistration: rssRegistration
      })
      .set('authorization', jwtToken)
      .set('Accept', 'application/json')
      .expect(400)
      .expect(res => {
          expect(res.body.errors.length).to.equal(1);
          res.body.errors[0].msg.should.have.property('category');
      })
      .end(done);
  });

  it('Should retrieve and populate the record', (done) => {
    $supertest(app)
      .get('/' + config.API_URL_PREFIX + '/rssRegistration/' + newRssRegistration._id)
      .set('authorization', jwtToken)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(res => {
        expect(_.isEqual(res.body.data.provider, newProvider)).to.equal(true);
      })
      .end(done);
  });


  function createCategory(done) {
    $supertest(app)
      .post('/' + config.API_URL_PREFIX + '/category')
      .send({
        Category: category
      })
      .set('authorization', jwtToken)
      .set('Accept', 'application/json')
      .expect(200)
      .expect(res => {
          newCategory = res.body.data;
      })
      .end(done);
  }

  function createProvider(done) {
    $supertest(app)
      .post('/' + config.API_URL_PREFIX + '/rssProvider')
      .send({
        RssProvider: provider
      })
      .set('authorization', jwtToken)
      .set('Accept', 'application/json')
      .expect(200)
      .expect(res => {
          newProvider = res.body.data;
      })
      .end(done);
  }

  function createRssRegistration(done) {
    rssRegistration.category = newCategory._id;
    rssRegistration.provider = newProvider._id;

    $supertest(app)
      .post('/' + config.API_URL_PREFIX + '/rssRegistration')
      .send({
        RssRegistration: rssRegistration
      })
      .set('authorization', jwtToken)
      .set('Accept', 'application/json')
      .expect(200)
      .expect(res => {
          newRssRegistration = res.body.data;
      })
      .end(done);
  }

});