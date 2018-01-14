/* jshint esversion:6, node:true  */

'use strict';

KlarkModule(module, 'rssRegistrationsFetcher', (
  _,
  q,
  $moment,
  $singleLineLog,
  krkDbMongooseBinders,
  krkLogger,
  config,
  modelsApp,
  modelsEntry,
  modelsRssRegistration,
  modelsFetchReport,
  rssRegistrationsFetcherIterationFetch
) => {
  const TRY_TO_FETCH_FREQUENT = 20 * 60 * 1000;
  const DATE_FORMAT = 'MM/DD/YYYY HH:mm:ss';
  let isFetching = false;

  return {
    fetch,
    startPeriodicalFetchProcess
  };

  function fetch(onFetchStartOpt, onNextChunkOpt) {
    const onFetchStart = onFetchStartOpt || _.noop;
    const onNextChunk = onNextChunkOpt || _.noop;

    if (isFetching) {
      return q.reject('already fetching');
    }
    isFetching = true;

    const finishedDefer = q.defer();

    const fetchReport = createFetchReport();

    fetchRegistrations()
      .then(startRssRegistrationFetch)
      .catch(reason => finishedDefer.reject(reason));

    const promise = finishedDefer.promise;
    promise.finally(() => isFetching = false);

    return promise;

    function fetchRegistrations() {
      return krkDbMongooseBinders.find(modelsRssRegistration)
        .catch(reason => finishedDefer.reject(reason))
    }

    function startRssRegistrationFetch(registrationsResp) {
    onFetchStart(registrationsResp);
      rssRegistrationsFetcherIterationFetch.fetch(
        registrationsResp,
        onIterationFetchFinished,
        onFinish
      );
    }

    function onIterationFetchFinished(registrationEntries) {
      return q.throttle({
        list: registrationEntries,
        promiseTransformator: handleRegistrationEntry,
        slices: 1
      })

      function handleRegistrationEntry(registrationEntry) {
        const rssRegistration = registrationEntry.rssRegistration;
        krkLogger.assert(rssRegistration, 'rssRegistration always exist');

        const majorError = registrationEntry.error;
        const translationErrors = registrationEntry.entriesResp
                                    && registrationEntry.entriesResp.errors;
        const error = majorError || translationErrors;

        if (!_.isEmpty(error) || _.isError(error)) {
          const failedFetch = {
            error: _.isError(error) ? error.toString() : error,
            rssRegistration: rssRegistration.id
          };
          fetchReport.failedFetches.push(failedFetch);
        }

        if (!_.isEmpty(majorError) || _.isError(error)) {
          return q.when();
        }

        const entries = registrationEntry.entriesResp.entries;
        fetchReport.succeededFetches += _.size(entries);
        fetchReport.totalFetches += _.size(translationErrors) + _.size(entries);

        if (_.isEmpty(entries)) {
          return q.when();
        }

        return q.resolve()
          .then(() => modelsEntry.saveAvoidingDuplications(entries))
          .then(savedEntries => fetchReport.entriesStored += _.size(savedEntries))
          .then(() => onNextChunk(rssRegistration));
      }
    }

    function onFinish(error) {
      if (error) {
        return finishedDefer.reject(error);
      }

      fetchReport.finished = new Date();

      krkDbMongooseBinders.create(modelsFetchReport, fetchReport)
        .then(newFetchReport => finishedDefer.resolve(newFetchReport))
        .catch(reason => finishedDefer.reject(reason))
    }
  }

  function createFetchReport() {
    return {
      totalFetches: 0,
      succeededFetches: 0,
      entriesStored: 0,
      started: new Date(),
      finished: undefined,
      log: '',
      failedFetches: []
    };
  }

  function startPeriodicalFetchProcess() {
    tryToFetch();
    setInterval(tryToFetch, TRY_TO_FETCH_FREQUENT);

    function tryToFetch() {
      modelsApp.getAppInfo()
        .then(appInfoFetched)
        .catch(reason => krkLogger.error(reason));
    }

    function appInfoFetched(appInfo) {
      let totalRegistrations;
      let resolvedRegistrations;

      const lastTime = appInfo.lastRssRegistrationFetch.getTime();
      const nextTime = lastTime + appInfo.rssRegistrationFetchFrequency;
      const currentTime = _.now();

      krkLogger.info(
        'Try to fetch',
        $moment(new Date(nextTime)).format(DATE_FORMAT),
        $moment(new Date(currentTime)).format(DATE_FORMAT)
      );
      if (nextTime > currentTime) {
        return;
      }
      krkLogger.info('Accepted');

      return fetch(onFetchStart, onNextChunk)
        .then(fetchReport => saveLastFetchTime()
                          .then(() => logSuccessFetch(fetchReport)))
        .catch(reason => krkLogger.error(reason));

      function onFetchStart(rssRegistrations) {
        totalRegistrations = rssRegistrations.length;
        resolvedRegistrations = 0;
      }

      function onNextChunk(rssRegistration) {
        ++resolvedRegistrations;
        const msg = `resolving registrations (${resolvedRegistrations}/${totalRegistrations})...${rssRegistration.link}`;
        $singleLineLog.stdout(msg);
      }
    }

    function saveLastFetchTime() {
      return modelsApp.updateAppInfo({
        lastRssRegistrationFetch: new Date()
      });
    }

    function logSuccessFetch(fetchReport) {
      const duration = $moment.utc(
        $moment(fetchReport.finished, DATE_FORMAT)
          .diff($moment(fetchReport.started, DATE_FORMAT))
      ).format('HH:mm:ss');

      const msgs = [
        '',
        'Rss registrations fetch finished successfully.',
        `Started: ${$moment(fetchReport.started).format(DATE_FORMAT)}`,
        `Finished: ${$moment(fetchReport.finished).format(DATE_FORMAT)}`,
        `Duration: ${duration}`,
        `Total fetched: ${fetchReport.totalFetches}`,
        `Total Stored: ${fetchReport.entriesStored}`,
        `Report id: ${fetchReport._id}`,
        ''
      ].join('\n');

      krkLogger.info('');
      krkLogger.info(msgs);
    }
  }

});
