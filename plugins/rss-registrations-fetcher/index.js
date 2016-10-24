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

  return {
    fetch
  };

  function fetch() {
    const finishedDefer = $q.defer();
    
    const fetchReport = createFetchReport();
    
    fetchRegistrations()
      .then(startRssRegistrationFetch);

    return finishedDefer.promise;

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
      const promiseOfEntries = $_.map(registrationEntries, registrationEntry => {
        const rssRegistration = registrationEntry.rssRegistration;
        logger.assert(rssRegistration, 'rssRegistration always exist');

        const majorError = registrationEntry.error;
        const translationErrors = registrationEntry.entriesResp 
                                    && registrationEntry.entriesResp.errors;
        const error = majorError || translationErrors;

        if (error) {
          const failedFetch = {
            error,
            rssRegistration: rssRegistration._id
          };
          fetchReport.failedFetches.push(failedFetch);
        }

        if (majorError) {
          return $q.when();
        }

        const entryModel = modelsEntry.getByCategoryLang(
          rssRegistration.lang,
          rssRegistration.category.name
        );        

        const entries = registrationEntry.entriesResp.entries;
        fetchReport.succeededFetches += $_.size(entries);
        fetchReport.totalFetches += $_.size(translationErrors) + $_.size(entries);

        if ($_.isEmpty(entries)) {
          return $q.when();
        }

        return dbMongooseBinders.create(entryModel, entries);              
      });

      return $q.all(promiseOfEntries);
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
      started: new Date(),
      finished: undefined,
      log: '',
      failedFetches: []
    };
  }

});