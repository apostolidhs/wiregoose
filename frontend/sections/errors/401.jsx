import React from 'react';
import FontAwesome from 'react-fontawesome';
import { Link } from 'react-router';

import tr from '../../components/localization/localization.js';
import { publish } from '../../components/events/events.js';

export default class InternalServerError extends React.Component {

  componentDidMount() {
    publish('page-ready', {
      status: 401,
      title: tr.errors401Title,
      description: tr.errors401Desc,
      keywords: '401,not found'
    });
  }

  render() {
    return (
      <div className="text-center">
        <h1>
          <FontAwesome name="chain-broken" />
        </h1>
        <h1>{tr.errors401Title}</h1>
        <p>{tr.errors401Desc}</p>
        <p>
          {tr.errors401Prompt} {''}
          <Link
            to="/"
            role="button"
            title={tr.exploreNews}
          >
            {tr.promptReading}
          </Link>
        </p>
      </div>
    );
  }

}
