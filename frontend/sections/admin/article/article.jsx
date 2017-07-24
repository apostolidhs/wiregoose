import _ from 'lodash';
import React from 'react';
import { Link } from 'react-router';
import TimeAgo from 'react-timeago';
import FontAwesome from 'react-fontawesome';

import ListView from '../../../components/list-view/list-view.jsx';
import Form from '../../../components/article/form.jsx';
import ResponseTransformation
  from '../../../components/article/response-transformation.js';
import * as TextUtilities
  from '../../../components/text-utilities/text-utilities.js';

export default class Articles extends ListView {
  static columns = [
    {
      id: 'title'
    },
    {
      id: 'error',
      dataFormat: (cell) => {
        if (cell) {
          return (<FontAwesome name="check" />);
        } else {
          return (<FontAwesome name="times" />);
        }
      },
      width: '80px'
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
      modelName: 'article',
      transformation: r => ResponseTransformation(r),
      columns: Articles.columns,
      title: 'Articles',
      form: Form
    });
  }
}
