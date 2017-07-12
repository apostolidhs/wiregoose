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
  modelsAuthor,
  modelsRssRegistration,
  modelsFetchReport,
  rssRegistrationsFetcherIterationFetch
) => {

  const tryToFetchFrequent = Math.max(
    Math.floor(config.RSS_REGISTRATIONS_FETCH_FREQUENT / 8),
    20 * 60 * 1000
  );
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

        if (!_.isEmpty(error)) {
          const failedFetch = {
            error,
            rssRegistration: rssRegistration.id
          };
          fetchReport.failedFetches.push(failedFetch);
        }

        if (!_.isEmpty(majorError)) {
          return q.when();
        }

        const entries = registrationEntry.entriesResp.entries;
        fetchReport.succeededFetches += _.size(entries);
        fetchReport.totalFetches += _.size(translationErrors) + _.size(entries);

        if (_.isEmpty(entries)) {
          return q.when();
        }

        const authors = _(entries)
          .filter(entry => entry.author)
          .map(entry => ({name: entry.author}))
          .value();

        return (_.isEmpty(authors) ? q.resolve() : modelsAuthor.saveManyIfNotExist(authors))
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
    setInterval(tryToFetch, tryToFetchFrequent);

    function tryToFetch() {
      modelsApp.getAppInfo()
        .catch(reason => krkLogger.error(reason))
        .then(appInfoFetched)
        .then(saveLastFetchTime)
        .catch(reason => krkLogger.error(reason));
    }

    function saveLastFetchTime() {
      return modelsApp.updateAppInfo({
        lastRssRegistrationFetch: new Date()
      });
    }

    function appInfoFetched(appInfo) {
      let totalRegistrations;
      let resolvedRegistrations;

      const lastTime = appInfo.lastRssRegistrationFetch.getTime();
      if (lastTime + config.RSS_REGISTRATIONS_FETCH_FREQUENT > _.now()) {
        return;
      }

      return fetch(onFetchStart, onNextChunk)
        .then(logSuccessFetch)
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

    function logSuccessFetch(fetchReport) {
      const dateFormat = 'MM/DD/YYYY HH:mm:ss';

      const duration = $moment.utc(
        $moment(fetchReport.finished, dateFormat)
          .diff($moment(fetchReport.started, dateFormat))
      ).format('HH:mm:ss');

      const msgs = [
        '',
        'Rss registrations fetch finished successfully.',
        `Started: ${$moment(fetchReport.started).format(dateFormat)}`,
        `Finished: ${$moment(fetchReport.finished).format(dateFormat)}`,
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
