import _ from 'lodash';
import React from 'react';
import { Link } from 'react-router';
import ListView from '../../../components/list-view/list-view.jsx';
import Form from '../../../components/rss-registration/form.jsx';

export default class RssRegistration extends ListView {
  static columns = [
    {
      id: 'category'
    },
    {
      id: 'link',
      width: '400',
      dataFormat: (cell) => (<Link to={cell} target="_blank">{cell}</Link>)
    },
    {
      id: 'lang'
    },
    {
      id: 'provider',
      dataFormat: (cell) => (<Link to={`/admin/rssprovider?_id=${cell._id}`}>{cell.name}</Link>)
    },
    {
      id: '_id',
      columnTitle: true
    },
  ];

  constructor() {
    super({
      modelName: 'rssRegistration',
      columns: RssRegistration.columns,
      title: 'Rss Registrations',
      form: Form
    });
  }

}
