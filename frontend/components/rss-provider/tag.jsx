import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

export default class Tag extends React.Component {

  static propTypes = {
    name: PropTypes.string.isRequired,
  }

  render() {
    const { name } = this.props;
    return (
      <Link to={`/provider/${name}`} className="btn btn-default" role="button" title={`${name} Provider`} >
        { name }
      </Link>
    );
  }

}
