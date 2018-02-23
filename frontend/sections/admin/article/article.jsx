import React from 'react';
import { Link } from 'react-router';
import FontAwesome from 'react-fontawesome';

import ListView from '../../../components/list-view/list-view.jsx';
import Form from '../../../components/article/form.jsx';
import ResponseTransformation
  from '../../../components/article/response-transformation.js';
import * as TextUtilities
  from '../../../components/utilities/text-utilities.js';
import FromNow from '../../../components/utilities/from-now.jsx';

export default class Articles extends ListView {
  static columns = [
    {
      id: 'title'
    },
    {
      id: 'link'
    },
    {
      id: 'createdAt',
      dataFormat: cell => <FromNow date={cell} />,
      width: '120px'
    },
    {
      id: 'entryId.hits',
      colName: 'Hits',
      dataFormat: (cell, {entryId}) => entryId.hits,
      width: '70px',
      dataSort: false,
      disableFilter: true
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
      width: '70px'
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
      form: Form,
      defaultSort: {
        defaultSortName: 'createdAt',
        defaultSortOrder: 'desc'
      }
    });
  }
}
