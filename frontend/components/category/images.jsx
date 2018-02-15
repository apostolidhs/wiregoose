import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';

export default class Images extends React.Component {

  static categoriesToIcon = {
    'Auto': 'car',
    'Country': 'map-marker',
    'Culture': 'book',
    'Economy': 'line-chart',
    'Entertainment': 'glass',
    'Environment': 'envira',
    'Food': 'cutlery',
    'Health': 'heart',
    'Lifestyle': 'users',
    'Media': 'television',
    'Politics': 'university',
    'Science': 'flask',
    'Society': 'users',
    'Sports': 'futbol-o',
    'Technology': 'laptop',
    'Travel': 'plane',
    'Viral': 'bullhorn',
    'World': 'globe'
  };

  static propTypes = {
    name: PropTypes.string.isRequired,
  }

  state = {
    icon: 'spinner'
  }

  componentDidMount = () => {
    const name = this.props.name;
    this.setState({ icon: Images.categoriesToIcon[name] || 'spinner' });
  }

  render() {
    //const className = `category-${_.lowerCase(this.props.name)}`;
    return (
      <FontAwesome name={ this.state.icon } />
    );
  }

}
