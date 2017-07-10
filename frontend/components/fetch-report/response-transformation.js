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
  return fetchReport;
}
