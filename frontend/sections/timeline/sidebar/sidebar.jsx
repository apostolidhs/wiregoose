import React from 'react';
import PropTypes from 'prop-types';

export default class Sidebar extends React.Component {

  render() {
    return (
      <div>
        <a id="home" className="menu-item" href="/">Home</a>
        <a id="about" className="menu-item" href="/about">About</a>
        <a id="contact" className="menu-item" href="/contact">Contact</a>
        <a onClick={ this.showSettings } className="menu-item--small" href="">Settings</a>
      </div>
    );
  }

}
