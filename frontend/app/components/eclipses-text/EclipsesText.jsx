import React, { Component } from 'react';
import _ from 'lodash';

export default class EclipsesText extends Component {
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
    const { text, size, ellipsis } = this.props;
    if (text.length > size) {
      let subtext = text.substring(0, size - 3);
      subtext = _.trimEnd(subtext);
      return `${subtext}${ellipsis}`;
    }
    return text;
  }

  render() {
    const text = this.calculateEclipseText();
    return (
      <span>{text}</span>
    );
  }
}
