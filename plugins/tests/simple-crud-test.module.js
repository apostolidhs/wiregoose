/* jshint esversion:6, node:true  */

'use strict';

let $$supertest;
let $$app;
let expect;
let $$_;
let $$config;
let $$dbMongooseConnector;

eamModule(module, 'testsApp', ($supertest, $chai, $_, app, config, dbMongooseConnector) => {
  $$supertest = $supertest;
  $$app = app;
  $$_ = $_;
  expect = $chai.expect;  
  $$config = config;
  $$dbMongooseConnector = dbMongooseConnector;
});

describe('Testing the CRUD functionality of a simple model', () => {

  before(done => {
    $$dbMongooseConnector.dropDatabase(done);
  });

  const category = {
    name: 'BBC'
  };
  let createCategory;

  it('Create one record', (done) => {
    $$supertest($$app)
      .post('/' + $$config.API_URL_PREFIX + '/category')
      .send({
        Category: category
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(res => {
          createCategory = res.body.data;
          expect(createCategory.name).to.equal(category.name);       
      })
      .end(done);
  });

  it('Retrieve one record', (done) => {
    $$supertest($$app)
      .get('/' + $$config.API_URL_PREFIX + '/category/' + createCategory._id)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(res => {
          const respCategory = res.body.data;
          expect($$_.isEqual(createCategory, respCategory)).to.equal(true);       
      })
      .end(done);
  });

  it('Retrieve all records', (done) => {
    $$supertest($$app)
      .get('/' + $$config.API_URL_PREFIX + '/category')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(res => {
          const respCategories = res.body.data.content;
          const respCount = res.body.data.count;
          expect(respCategories.length).to.equal(1);
          expect($$_.isEqual(createCategory, respCategories[0])).to.equal(true);      
          expect(respCount).to.equal(1);     
      })
      .end(done);
  });

  it('Update one record', (done) => {
    category.name = 'CNN';

    $$supertest($$app)
      .put('/' + $$config.API_URL_PREFIX + '/category/' + createCategory._id)
      .send({
        Category: category
      })      
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

  it('Delete one record', (done) => {
    $$supertest($$app)
      .delete('/' + $$config.API_URL_PREFIX + '/category/' + createCategory._id)
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

  it('Retrieve all records, no records after delete', (done) => {
    $$supertest($$app)
      .get('/' + $$config.API_URL_PREFIX + '/category')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(res => {
          const respCategories = res.body.data.content;
          const respCount = res.body.data.count;
          expect(respCategories.length).to.equal(0);     
          expect(respCount).to.equal(0);     
      })
      .end(done);
  });  

});