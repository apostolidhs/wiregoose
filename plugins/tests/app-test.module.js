/* jshint esversion:6, node:true  */

'use strict';

let supertest;
let app;
let expect;
let _;

KlarkModule(module, 'testsApp', (_$supertest_, $chai, ___, _app_) => {
  supertest = _$supertest_;
  app = _app_.create();
  _ = ___;
  expect = $chai.expect;
});

describe('GET /info', function() {
  it('Should respond with application info', function(done) {
    supertest(app)
      .get('/info')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(res => {
        expect(_.isString(res.body.data.currentVersion)).to.equal(true);
      })
      .end(done);
  });
});
