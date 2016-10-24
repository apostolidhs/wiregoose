/* jshint esversion:6, node:true  */

'use strict';

eamModule(module, 'rssRegistrationsFetcherIterationFetch', (
  $_,
  $q,
  rssTranslator
) => {

  return {
    fetch
  };

  function fetch(rssRegistrations, onIterationFetchFinished, onFinish) {
    const rssRegistrationsByProvider = $_.groupBy(rssRegistrations, r => r.provider.name);
    startFetchIteration(rssRegistrationsByProvider, onIterationFetchFinished, onFinish);
  }

  function startFetchIteration(rssRegistrationsByProvider, onIterationFetchFinished, onFinish) {
    const nextIteration = getNextIteration(rssRegistrationsByProvider);

    if ($_.isEmpty(nextIteration)) {
      return onFinish();
    }

    performFetch(nextIteration)
      .then(resolvedBatchOfEntries => handleFetchResult(resolvedBatchOfEntries, nextIteration, onIterationFetchFinished))
      .then(() => startFetchIteration(rssRegistrationsByProvider, onIterationFetchFinished, onFinish))
      .catch(onFinish);
  }

  function handleFetchResult(batchOfEntries, iteration, onIterationFetchFinished) {
    const registrationEntries = $_.map(batchOfEntries, (resolvedPromise, idx) => {
      const registrationEntry = {
        rssRegistration: iteration[idx]
      };

      if (resolvedPromise.state === 'fulfilled') {
        registrationEntry.entriesResp = resolvedPromise.value;        
      } else {
        registrationEntry.error = resolvedPromise.reason; 
      }

      return registrationEntry;
    });
    return onIterationFetchFinished(registrationEntries);
  }

  function getNextIteration(rssRegistrationsByProvider) {
    return $_.chain(rssRegistrationsByProvider)
      .filter(r => !$_.isEmpty(r))
      .map(r => r.pop())
      .value();
  }

  function performFetch(iteration) {
    const promisesOfEntries = $_.map(
      iteration, 
      rssRegistration => rssTranslator.translateFromUrl(rssRegistration.link, rssRegistration.provider.name)
    );
    return $q.allSettled(promisesOfEntries);
  }

});