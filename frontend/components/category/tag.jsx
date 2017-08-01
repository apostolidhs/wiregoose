import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { Badge } from 'react-bootstrap';

export default class Tag extends React.Component {

  static propTypes = {
    name: PropTypes.string.isRequired,
  }

  render() {
    const { name, ...passDownProps } = this.props;
    passDownProps.className = (passDownProps.className || '') + ' w-tag';

    return (
      <Link
        to={`/category/${name}`}
        role="button"
        title={`${name} Category`}
        {...passDownProps}
      >
        <Badge>{ name }</Badge>
      </Link>
    );
  }

}
