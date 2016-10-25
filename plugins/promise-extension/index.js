/* jshint esversion:6, node:true  */

'use strict';

eamModule(module, 'promiseExtension', () => {

  return {
    extend
  };

  function extend(q) {

    q.promisify = promisify;
    q.throttledResolve = throttledResolve;

    function promisify(ctx) {
      const deferred = q.defer();
      ctx().exec((err, record) => {
          if (err) {
            deferred.reject(err);
          } else {
            deferred.resolve(record);
          }
      });
      return deferred.promise;
    }

    function throttledResolve(collection, promiseTransformator, slices, timeout) {
      const iterations = Math.floor(collection.length / slices);
      let from = 0;
      let to =       
      innerThrottledResolve(from, to);

      function innerThrottledResolve(from, to) {
        return q.all(collection.slice(0, n).map(promiseTransformator));
      }
    }
  }

});