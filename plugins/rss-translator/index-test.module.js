/* jshint esversion:6, node:true  */

'use strict';

let rssTranslator;
let expect;

KlarkModule(module, 'rssTranslatorTest', ($chai, _rssTranslator_) => {
  rssTranslator = _rssTranslator_;
  expect = $chai.expect;
});

describe('rssTranslator', function() {
  it('Should translate an source with eclosed image', function(done) {
    rssTranslator.translateFromFile('plugins/tests/rss-feeds/enclosed-img.xml', 'mockProvider')
      .then(report => {
        expect(report.entries.length > 0).to.equal(true);
        expect(report.errors.length).to.equal(0);
      })
      .catch(() => expect(false).to.equal(true))
      .finally(done);
  });
  it('Should translate an source with image tag on description', function(done) {
    rssTranslator.translateFromFile('plugins/tests/rss-feeds/image-on-description.xml', 'mockProvider')
      .then(report => {
        expect(report.entries.length > 0).to.equal(true);
        expect(report.errors.length).to.equal(0);
      })
      .catch(() => expect(false).to.equal(true))
      .finally(done);
  });
});
