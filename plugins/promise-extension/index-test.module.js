/* jshint esversion:6, node:true  */

'use strict';

let $$supertest;
let $$promiseExtension;
let $$q;
let $$_;
let expect;

eamModule(module, 'promiseExtensionTest', ($supertest, $chai, $_, $q, promiseExtension) => {
  $$supertest = $supertest;
  $$promiseExtension = promiseExtension;
  $$q = $q;
  $$_ = $_;
  expect = $chai.expect;
});

describe('rssTranslator', function() {

  before(() => $$promiseExtension.extend($$q));

  it('Should resolve the promises by throttling them', function(done) {
    const list = $$_.times(50);
    let sequence = 0;
    const start = $$_.now();
    $$q.throttle({
      list,
      promiseTransformator: (item, idx) => {
        expect(item).to.equal(idx);
        expect(sequence).to.equal(idx);
        ++sequence;
        return $$q.when(idx * 10);
      },
      slices: 5, 
      timeout: 10, 
      policy: 'all'      
    })
    .then(resolvedList => {
      const healthyResolved = $$_.every(resolvedList, (item, idx) => item === idx * 10);
      expect(healthyResolved).to.equal(true);
      expect($$_.now() - start > 50).to.equal(true);
      done();
    });
  });

});
