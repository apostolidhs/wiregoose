import _ from 'lodash';

export default function translate(fetchReport) {
  if (fetchReport.started) {
    fetchReport.started = new Date(fetchReport.started);
  }
  if (fetchReport.finished) {
    fetchReport.finished = new Date(fetchReport.finished);
  }
  if (fetchReport.finished && fetchReport.started) {
    fetchReport.duration = fetchReport.finished.getTime()
                      - fetchReport.started.getTime();
  }
  fetchReport.failedFetches = fetchReport.totalFetches - fetchReport.succeededFetches;
  fetchReport.succeededFetchesPerc = Math.round((fetchReport.succeededFetches / fetchReport.totalFetches) * 100);
  fetchReport.entriesAborted = fetchReport.succeededFetches - fetchReport.entriesStored;
  fetchReport.succeededEntriesPerc = Math.round((fetchReport.entriesStored / fetchReport.succeededFetches) * 100);
  return fetchReport;
}
