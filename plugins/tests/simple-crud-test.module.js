/* jshint esversion:6, node:true  */

'use strict';

let $supertest;
let app;
let expect;
let _;
let config;
let testsPrepareDb;

KlarkModule(module, 'testsSimpleCrud', (_$supertest_, $chai, ___, _app_, _config_, _testsPrepareDb_) => {
  $supertest = _$supertest_;
  app = _app_.create();
  _ = ___;
  expect = $chai.expect;
  config = _config_;
  testsPrepareDb = _testsPrepareDb_;
});

describe('Testing the CRUD functionality of a simple model', () => {

  let jwtToken;
  before(() => testsPrepareDb.connectWithAdmin(true)
                .then(pallet => jwtToken = pallet.token)
  );

  const category = {
    name: 'BBC'
  };
  let createCategory;

  it('Should create one record', (done) => {
    $supertest(app)
      .post('/' + config.API_URL_PREFIX + '/category')
      .send({
        Category: category
      })
      .set('Accept', 'application/json')
      .set('authorization', jwtToken)
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(res => {
        createCategory = res.body.data;
        expect(createCategory.name).to.equal(category.name);
      })
      .end(done);
  });

  it('Should retrieve one record', (done) => {
    $supertest(app)
      .get('/' + config.API_URL_PREFIX + '/category/' + createCategory._id)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(res => {
          const respCategory = res.body.data;
          expect(_.isEqual(createCategory, respCategory)).to.equal(true);
      })
      .end(done);
  });

  it('Should retrieve all records', (done) => {
    $supertest(app)
      .get('/' + config.API_URL_PREFIX + '/category')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(res => {
          const respCategories = res.body.data.content;
          expect(respCategories.length).to.equal(1);
          expect(_.isEqual(createCategory, respCategories[0])).to.equal(true);
          expect(res.body.data.total).to.equal(1);
      })
      .end(done);
  });

  it('Should update one record', (done) => {
    category.name = 'CNN';
    $supertest(app)
      .put('/' + config.API_URL_PREFIX + '/category/' + createCategory._id)
      .send({
        Category: category
      })
      .set('authorization', jwtToken)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(res => {
          const respCategory = res.body.data;
          expect(category.name).to.equal(respCategory.name);
          expect(createCategory._id).to.equal(respCategory._id);
      })
      .end(done);
  });

  it('Should delete one record', (done) => {
    $supertest(app)
      .delete('/' + config.API_URL_PREFIX + '/category/' + createCategory._id)
      .set('authorization', jwtToken)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(res => {
          const data = res.body.data;
          expect(data.ok).to.equal(1);
          expect(data.n).to.equal(1);
      })
      .end(done);
  });

  it('Should retrieve all records, no records after delete', (done) => {
    $supertest(app)
      .get('/' + config.API_URL_PREFIX + '/category')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(res => {
          const respCategories = res.body.data.content;
          expect(respCategories.length).to.equal(0);
          expect(res.body.data.total).to.equal(0);
      })
      .end(done);
  });

});