/* jshint esversion:6, node:true  */

'use strict';

KlarkModule(module, 'requestBuilder', (_, $request) => {
  const acceptTypes = [
    'text/html',
    'application/xhtml+xml',
    'image/gif',
    'image/jpeg',
    'image/png',
    'image/svg+xml'
  ].join(',');

  const defaultValues = {
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36',
    timeout: 15 * 1000
  };

  return {create};

  function create(url, opts = {}) {
    const {timeout, userAgent} = _.defaults(opts, defaultValues);
    const req = $request(url, {timeout});
    req.setHeader('user-agent', userAgent);
    req.setHeader('accept', acceptTypes);
    return req;
  }
});
