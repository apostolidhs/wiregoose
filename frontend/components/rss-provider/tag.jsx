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

    return (
      <Link
        to={`/provider/${name}`}
        className="btn btn-default"
        role="button"
        title={`${name} ${tr.trFa('provider')}`}
        {...passDownProps}
      >
        <Badge>{ name }</Badge>
      </Link>
    );
  }

}
