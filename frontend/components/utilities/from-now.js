import React from 'react';
import PropTypes from 'prop-types';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Tooltip from 'react-bootstrap/lib/Tooltip';
import { fromNow, toText } from './dates.js';

export default class FromNow extends React.Component {

  static propTypes = {
    date: PropTypes.instanceOf(Date)
  }

  render() {
    const {
      date,
      ...passDownProps
    } = this.props;

    return (
      <span {...passDownProps} >
        <OverlayTrigger placement="top" overlay={this.renderTooltip(date)}>
          <span>{fromNow(date)}</span>
        </OverlayTrigger>
      </span>
    );
  }

  renderTooltip = (date) => {
    return (
      <Tooltip id="w-from-now">{toText(date, true)}</Tooltip>
    );
  }
}
