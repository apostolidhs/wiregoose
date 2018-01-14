import _ from 'lodash';

export default function translate(fetchReport) {
  if (fetchReport.started) {
    fetchReport.started = new Date(fetchReport.started);
  }
  if (fetchReport.finished) {
    fetchReport.finished = new Date(fetchReport.finished);
  }
  if (fetchReport.finished && fetchReport.started) {
    fetchReport.duration = Math.round((fetchReport.finished.getTime()
                      - fetchReport.started.getTime()) / (1000));
  }
  if (fetchReport.failedFetches) {
    fetchReport.failedFetches = _.map(fetchReport.failedFetches, f => _.omit(f, ['_id']));
  }
  fetchReport.unsucceededFetches = fetchReport.totalFetches - fetchReport.succeededFetches;
  fetchReport.succeededFetchesPerc = Math.round((fetchReport.succeededFetches / fetchReport.totalFetches) * 100);
  fetchReport.entriesAborted = fetchReport.succeededFetches - fetchReport.entriesStored;
  fetchReport.succeededEntriesPerc = Math.round((fetchReport.entriesStored / fetchReport.succeededFetches) * 100);
  return fetchReport;
}
