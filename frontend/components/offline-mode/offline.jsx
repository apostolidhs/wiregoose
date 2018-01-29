import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import FontAwesome from 'react-fontawesome';
import classnames from 'classnames';

import tr from '../localization/localization.js';

export default class Facebook extends React.Component {
  render() {
    return (
      <div className="text-center">
        <h1><FontAwesome name="wifi" className="text-warning" /></h1>
        <h3>{tr.offlineModeTitle}</h3>
        <p>
          <strong>
            <Link
              to="/"
              role="button"
              title={tr.exploreNews}
            >
              {tr.offlineModeCta}
            </Link>
          </strong>
        </p>
        <p>
          {tr.or}
          {' '}
          <a href="#" onClick={evt => {evt.preventDefault(); location.reload()}}>
            {tr.refresh}
          </a>
        </p>
      </div>
    );
  }
}
