import _ from 'lodash';
import React from 'react';
import { Link } from 'react-router';
import ListView from '../../../components/list-view/list-view.jsx';
import Form from '../../../components/fetch-report/form.jsx';

import FromNow from '../../../components/utilities/from-now.jsx';
import ResponseTransformation
  from '../../../components/fetch-report/response-transformation.js';
import * as DateUtilities
  from '../../../components/utilities/dates.js';

export default class RssFetchReport extends ListView {
  static columns = [
    {
      id: 'totalFetches'
    },
    {
      id: 'succeededFetches'
    },
    {
      id: 'entriesStored'
    },
    {
      id: 'entriesStored',
      colName: 'Success/Stored Rate',
      dataFormat: (cell, { succeededFetchesPerc, succeededEntriesPerc }) => {
        return (
          <span>
            <span>{succeededFetchesPerc}</span> / <span>{succeededEntriesPerc}</span>
          </span>
        )
      },
      dataSort: false
    },
    {
      id: 'started',
      colName: 'Duration',
      dataFormat: (cell, { duration, started }) => {
        return (
          <span>
            {DateUtilities.toText(started, true)}
            (<FromNow date={_.now() - (duration * 1000)} />)
          </span>
        )
      },
      width: '260px'
    },
    {
      id: '_id',
      columnTitle: true,
      width: '70px'
    }
  ];

  constructor() {
    super({
      modelName: 'fetchReport',
      transformation: r => ResponseTransformation(r),
      columns: RssFetchReport.columns,
      title: 'Rss Fetch Report',
      form: Form,
      mutable: false
    });
  }
}
