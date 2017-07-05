import _ from 'lodash';
import React from 'react';
import { Link } from 'react-router';
import ListView from '../../../components/list-view/list-view.jsx';
import Form from '../../../components/rss-provider/form.jsx';

export default class RssProvider extends ListView {
  static columns = [
    {
      id: 'name'
    },
    {
      id: 'link',
      width: '400',
      dataFormat: (cell) => (<Link to={cell} target="_blank">{cell}</Link>)
    },
    {
      id: '_id',
      columnTitle: true
    },
  ];

  constructor() {
    super({
      modelName: 'rssProvider',
      columns: RssProvider.columns,
      title: 'Rss Providers',
      form: Form
    });
  }
}
