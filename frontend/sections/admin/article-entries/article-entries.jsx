import _ from 'lodash';
import React from 'react';
import { Link } from 'react-router';
import TimeAgo from 'react-timeago';

import ListView from '../../../components/list-view/list-view.jsx';
import Form from '../../../components/article-box/form.jsx';
import ResponseTransformation
  from '../../../components/article-box/response-transformation.js';
import * as TextUtilities
  from '../../../components/text-utilities/text-utilities.js';

export default class ArticleEntries extends ListView {
  static columns = [
    {
      id: 'title'
    },
    {
      id: 'link'
    },
    {
      id: '_id',
      columnTitle: true,
      width: '70px'
    }
  ];

  constructor() {
    super({
      modelName: 'entry',
      transformation: r => ResponseTransformation(r),
      columns: ArticleEntries.columns,
      title: 'Article Entries',
      form: Form
    });
  }
}
