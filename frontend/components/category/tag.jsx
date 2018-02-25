import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import Badge from 'react-bootstrap/lib/Badge';

import tr from '../localization/localization.js';

export default class Tag extends React.Component {

  static propTypes = {
    name: PropTypes.string.isRequired,
  }

  render() {
    const { name, ...passDownProps } = this.props;
    passDownProps.className = (passDownProps.className || '') + ' w-tag';
    const friendlyName = tr[name];

    return (
      <Link
        to={`/category/${name}`}
        role="button"
        title={`${friendlyName} ${tr.trFa('category')}`}
        aria-label={friendlyName}
        {...passDownProps}
      >
        <Badge>{ friendlyName }</Badge>
      </Link>
    );
  }

}
