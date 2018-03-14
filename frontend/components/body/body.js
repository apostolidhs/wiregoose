import throttle from 'lodash/throttle';
import React from 'react';
import PropTypes from 'prop-types';

import Header from '../header/header.js';
import Notifications from '../notifications/notifications.js';
import Modals from '../modals/modals.js';
import SubHeader from '../content-selector/sub-header.js';
import componentSize from '../responsible/component-size.js';

export default class Body extends React.Component {

  static propTypes = {
    children: PropTypes.node.isRequired,
  }

  state = {}

  componentDidMount() {
    this.onResize();
    window.addEventListener('resize', this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  onResize = throttle(() => {
    const displaySubheader = componentSize.sizeFormatter({
      xxs: false,
      xs: false,
    }, true)(window.innerWidth);
    this.setState({displaySubheader});
  }, 200)

  render() {
    return (
      <div>
        <Header />
        {this.state.displaySubheader &&
          <SubHeader />
        }
        <Notifications />
        <div className="container routes-container">
          {this.props.children}
        </div>
        <Modals />
      </div>
    );
  }
}
