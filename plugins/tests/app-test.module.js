/* jshint esversion:6, node:true  */

'use strict';

let $$supertest;
let $$app;
let expect;
let $_;

KlarkModule(module, 'testsApp', ($supertest, $chai, _, app) => {
  $$supertest = $supertest;
  $$app = app.create();
  $_ = _;
  expect = $chai.expect;
});

describe('GET /info', function() {
  it('Should respond with application info', function(done) {
    $$supertest($$app)
      .get('/info')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(res => {
        expect($_.isString(res.body.data.currentVersion)).to.equal(true);
      })
      .end(done);
  });
});
