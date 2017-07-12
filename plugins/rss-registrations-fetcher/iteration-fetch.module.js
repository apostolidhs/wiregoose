/* jshint esversion:6, node:true  */

'use strict';

KlarkModule(module, 'rssRegistrationsFetcherIterationFetch', (
  _,
  q,
  modelsEntry,
  rssTranslator
) => {

  return {
    fetch
  };

  function fetch(rssRegistrations, onIterationFetchFinished, onFinish) {
    const rssRegistrationsByProvider = _.groupBy(rssRegistrations, r => r.provider.name);
    startFetchIteration(rssRegistrationsByProvider, onIterationFetchFinished, onFinish);
  }

  function startFetchIteration(rssRegistrationsByProvider, onIterationFetchFinished, onFinish) {
    const nextIteration = getNextIteration(rssRegistrationsByProvider);

    if (_.isEmpty(nextIteration)) {
      return onFinish();
    }

    performFetch(nextIteration)
      .then(resolvedBatchOfEntries => handleFetchResult(resolvedBatchOfEntries, nextIteration, onIterationFetchFinished))
      .then(() => startFetchIteration(rssRegistrationsByProvider, onIterationFetchFinished, onFinish))
      .catch(onFinish);
  }

  function handleFetchResult(batchOfEntries, iteration, onIterationFetchFinished) {
    const registrationEntries = _.map(batchOfEntries, (resolvedPromise, idx) => {
      const rssRegistration = iteration[idx];
      const registrationEntry = {
        rssRegistration
      };

      if (resolvedPromise.state === 'fulfilled') {
        const entriesResp = resolvedPromise.value;
        entriesResp.entries = _.map(entriesResp.entries, entry => new modelsEntry(entry));
        registrationEntry.entriesResp = entriesResp;
      } else {
        registrationEntry.error = resolvedPromise.reason;
      }

      return registrationEntry;
    });
    return onIterationFetchFinished(registrationEntries);
  }

  function getNextIteration(rssRegistrationsByProvider) {
    return _.chain(rssRegistrationsByProvider)
      .filter(r => !_.isEmpty(r))
      .map(r => r.pop())
      .value();
  }

  function performFetch(iteration) {
    return q.throttle({
      list: iteration,
      promiseTransformator: rssRegistration => rssTranslator.translateFromUrl(rssRegistration.link, rssRegistration.provider.name),
      policy: 'allSettled'
    });
  }

});
