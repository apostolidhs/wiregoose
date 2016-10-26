/* jshint esversion:6, node:true  */

'use strict';

eamModule(module, 'rssRegistrationsFetcher', (
  $_,
  $q,
  logger,
  modelsEntry,
  dbMongooseBinders,
  modelsRssRegistration,
  modelsFetchReport,
  rssRegistrationsFetcherIterationFetch
) => {

  let isFetching = false;

  return {
    fetch
  };  

  function fetch() {
    if (isFetching) {
      return $q.reject('already fetching');
    }
    isFetching = true;

    const finishedDefer = $q.defer();
    
    const fetchReport = createFetchReport();
    
    fetchRegistrations()
      .then(startRssRegistrationFetch);

    const promise = finishedDefer.promise;
    promise.finally(() => isFetching = false);

    return promise;

    function fetchRegistrations() {
      return dbMongooseBinders.find(modelsRssRegistration)
        .catch(reason => finishedDefer.reject(reason))
    }

    function startRssRegistrationFetch(registrationsResp) {
      rssRegistrationsFetcherIterationFetch.fetch(
        registrationsResp, 
        onIterationFetchFinished, 
        onFinish
      );
    }

    function onIterationFetchFinished(registrationEntries) {
      return $q.throttle({
        list: registrationEntries, 
        promiseTransformator: handleRegistrationEntry,
        slices: 1
      })

      function handleRegistrationEntry(registrationEntry) {
        const rssRegistration = registrationEntry.rssRegistration;
        logger.assert(rssRegistration, 'rssRegistration always exist');

        const majorError = registrationEntry.error;
        const translationErrors = registrationEntry.entriesResp 
                                    && registrationEntry.entriesResp.errors;
        const error = majorError || translationErrors;

        if (!$_.isEmpty(error)) {
          const failedFetch = {
            error,
            rssRegistration: rssRegistration.id
          };
          fetchReport.failedFetches.push(failedFetch);
        }

        if (!$_.isEmpty(majorError)) {
          return $q.when();
        }

        const entryModel = modelsEntry.getByCategoryLang(
          rssRegistration.category.name,
          rssRegistration.lang
        );        

        const entries = registrationEntry.entriesResp.entries;
        fetchReport.succeededFetches += $_.size(entries);
        fetchReport.totalFetches += $_.size(translationErrors) + $_.size(entries);

        if ($_.isEmpty(entries)) {
          return $q.when();
        }

        return entryModel.saveAvoidingDuplications(entries)
          .then(savedEntries => fetchReport.entriesStored += $_.size(savedEntries)) 
      }
    }

    function onFinish(error) {
      if (error) {
        return finishedDefer.reject(error);
      }

      fetchReport.finished = new Date();

      dbMongooseBinders.create(modelsFetchReport, fetchReport)
        .then(newFetchReport => finishedDefer.resolve(newFetchReport))
        .catch(reason => finishedDefer.reject(reason))
    }      
  }

  function createFetchReport() {
    return {
      success: false,
      totalFetches: 0,
      succeededFetches: 0,
      entriesStored: 0,
      started: new Date(),
      finished: undefined,
      log: '',
      failedFetches: []
    };
  }

});