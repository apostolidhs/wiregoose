import React, { Component } from 'react';

export default class Header extends Component {
  static propTypes = {
    text: React.PropTypes.string.isRequired,
    size: React.PropTypes.number,
    ellipsis: React.PropTypes.string,
  }

  static defaultProps = {
    size: 30,
    ellipsis: '...',
  }

  calculateEclipseText = () => {
    return this.props.text;
  }

  render() {
    const text = this.calculateEclipseText();
    return (
      <span>
        {text}
      </span>
    );
  }
}
