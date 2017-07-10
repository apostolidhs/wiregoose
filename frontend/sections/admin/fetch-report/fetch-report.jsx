import _ from 'lodash';
import React from 'react';
import { Link } from 'react-router';
import ListView from '../../../components/list-view/list-view.jsx';
import Form from '../../../components/fetch-report/form.jsx';
import TimeAgo from 'react-timeago';

import ResponseTransformation
  from '../../../components/fetch-report/response-transformation.js';
import * as TextUtilities
  from '../../../components/text-utilities/text-utilities.js';

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
      id: 'started',
      colName: 'Duration',
      dataFormat: (cell, { duration, started }) => {
        return <span>{TextUtilities.dateToText(started, true)} (<TimeAgo date={_.now() - duration} live={false} />)</span>
      },
      width: '300'
    },
    {
      id: '_id',
      columnTitle: true
    }
  ];

  constructor() {
    super({
      modelName: 'fetchReport',
      transformation: r => ResponseTransformation(r),
      columns: RssFetchReport.columns,
      title: 'Rss Fetch Report',
      form: Form
    });
  }
}
