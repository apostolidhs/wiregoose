import React from 'react';
import FontAwesome from 'react-fontawesome';
import { Link } from 'react-router';

import tr from '../../components/localization/localization.js';

export default class InternalServerError extends React.Component {

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
