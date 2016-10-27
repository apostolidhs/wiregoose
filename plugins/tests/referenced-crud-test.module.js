/* jshint esversion:6, node:true  */

'use strict';

let $$supertest;
let $$app;
let expect;
let should;
let $$_;
let $$config;
let $$dbMongooseConnector;

eamModule(module, 'testsApp', ($supertest, $chai, $_, app, config, dbMongooseConnector) => {
  $$supertest = $supertest;
  $$app = app.create();
  $$_ = $_;
  expect = $chai.expect;
  should = $chai.should();
  $$config = config;
  $$dbMongooseConnector = dbMongooseConnector;
});

describe('Testing the CRUD functionality of a referenced model', () => {

  before(done => {
    $$dbMongooseConnector.connect()
      .then(() => $$dbMongooseConnector.dropDatabase())
      .then(() => done());
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

    $$supertest($$app)
      .post('/' + $$config.API_URL_PREFIX + '/rssRegistration')
      .send({
        RssRegistration: rssRegistration
      })
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

    $$supertest($$app)
      .put('/' + $$config.API_URL_PREFIX + '/rssRegistration/' + newRssRegistration._id)
      .send({
        RssRegistration: rssRegistration
      })
      .set('Accept', 'application/json')
      .expect(400)
      .expect(res => {
          expect(res.body.errors.length).to.equal(1);
          res.body.errors[0].msg.should.have.property('category');
      })
      .end(done);
  });

  it('Should retrieve and populate the record', (done) => {
    $$supertest($$app)
      .get('/' + $$config.API_URL_PREFIX + '/rssRegistration/' + newRssRegistration._id)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(res => {
        expect($$_.isEqual(res.body.data.provider, newProvider)).to.equal(true);
      })
      .end(done);
  });


  function createCategory(done) {
    $$supertest($$app)
      .post('/' + $$config.API_URL_PREFIX + '/category')
      .send({
        Category: category
      })
      .set('Accept', 'application/json')
      .expect(200)
      .expect(res => {
          newCategory = res.body.data;
      })
      .end(done);
  }

  function createProvider(done) {
    $$supertest($$app)
      .post('/' + $$config.API_URL_PREFIX + '/rssProvider')
      .send({
        RssProvider: provider
      })
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

    $$supertest($$app)
      .post('/' + $$config.API_URL_PREFIX + '/rssRegistration')
      .send({
        RssRegistration: rssRegistration
      })
      .set('Accept', 'application/json')
      .expect(200)
      .expect(res => {
          newRssRegistration = res.body.data;
      })
      .end(done);
  }

});