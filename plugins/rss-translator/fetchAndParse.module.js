/* jshint esversion:6, node:true  */

'use strict';

eamModule(module, 'rssTranslatorFetchAndParse', ($fs, $q, $request, $feedparser, logger) => {
  return {
    fromUrl: createStream('url'),
    fromFile: createStream('file')
  };

  function createStream(sourceType) {
    return (source) => {
      let errorOccured = false;
      const deferred = $q.defer();
      const feedparser = new $feedparser({addmeta: false});
      const items = [];

      feedparser.on('error', onError);
      feedparser.on('readable', readFeadParserStream);
      feedparser.on('end', onFinish);

      if (sourceType === 'url') {
        fromUrl(source);
      } else if (sourceType === 'file') {
        fromFile(source);
      } else {
        logger.assert(false, `sourceType ${sourceType} is not supported`);
      }

      return deferred.promise;

      function fromUrl(url) {
        const req = createRequest(url);

        req.on('error', onError);
        req.on('response', readRequestStream);
      }

      function fromFile(filepath) {
        const readStream = $fs.createReadStream(filepath);

        readStream.on('open', function () {
          readStream.pipe(feedparser);
        });

        readStream.on('error', onError);
      }

      function createRequest(url) {
        const req = $request(url, {timeout: 10000});
        req.setHeader('user-agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36');
        req.setHeader('accept', 'text/html,application/xhtml+xml');

        return req;
      }

      function readRequestStream(res) {
        const stream = this;

        // sometimes it is '200'
        if (res.statusCode != 200) {
          return this.emit('error', new Error('Bad status code'));
        }

        stream.pipe(feedparser);
      }

      function readFeadParserStream() {
        const stream = this;
        let item;

        while (item = stream.read()) {
          items.push(item);
        }
      }

      function onError(error) {
        if (!errorOccured) {
          errorOccured = true;
          deferred.reject(error);
        }
      }

      function onFinish(error) {
        if (error && !errorOccured) {
          errorOccured = true;
          deferred.reject(error);
        } else {
          deferred.resolve(items);
        }
      }
    };
  }

});