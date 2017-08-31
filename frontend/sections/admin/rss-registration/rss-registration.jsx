import _ from 'lodash';
import React from 'react';
import { Link } from 'react-router';

import * as WiregooseApi from '../../../components/services/wiregoose-api.js';
import Loader from '../../../components/loader/loader.jsx';
import ListView from '../../../components/list-view/list-view.jsx';
import Form from '../../../components/rss-registration/form.jsx';
import RssRegistrationFetches from '../../../components/measures/rss-registrations-fetches.jsx';

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

  componentDidMount() {
    super.componentDidMount();
    this.fetchRssRegistrationsFetches();
  }

  constructor() {
    super({
      modelName: 'rssRegistration',
      columns: RssRegistration.columns,
      title: 'Rss Registrations',
      form: Form
    });
  }

  fetchRssRegistrationsFetches = () => {
    this.refs.registrationsFetchesLoad.promise = WiregooseApi.getRssRegistrationsFetches()
      .then(resp => this.setState({ registrationsFetches: resp.data.data }));
  }

  afterTable = () => {
    return (
      <Loader ref="registrationsFetchesLoad" >
        <RssRegistrationFetches registrationsFetches={this.state.registrationsFetches} />
      </Loader>
    );
  }
}
