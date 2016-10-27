/* jshint esversion:6, node:true  */

'use strict';

eamModule(module, 'promiseExtension', ($_) => {

  return {
    extend
  };

  function extend(q) {

    q.promisify = promisify;
    q.throttle = throttle;

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

    function throttle(opts) {
      if (!(opts && opts.list && opts.promiseTransformator)) {
        throw new Error('invalid arguments');
      }

      $_.defaultsDeep(opts, getDefaultValues());

      const deferred = q.defer();
      const chunks = $_.chunk(opts.list, opts.slices);
      const chunksLen = chunks.length; 
      let result = [];
      
      innerThrottledResolve(0, 0);

      return deferred.promise;

      function innerThrottledResolve(sliceIdx, listIdx) {
        if (sliceIdx >= chunksLen) {
          return deferred.resolve(result);
        }
        const chunk = chunks[sliceIdx];
        const promisesOfChuck = $_.map(chunk, item => opts.promiseTransformator(item, listIdx++));
        const promisesOfChuckResolver = q[opts.policy](promisesOfChuck);
        return promisesOfChuckResolver
          .then(resolvedChucks => result = result.concat(resolvedChucks))
          .then(() => 
              $_.delay(() => innerThrottledResolve(++sliceIdx, listIdx), opts.timeout)
            )
          .catch(reason => deferred.reject(reason));
      }

      function getDefaultValues() {
        return {
          slices: 5, 
          timeout: 10, 
          policy: 'all'
        };
      }
    }
  }

});