import throttle from 'lodash/throttle';
import React from 'react';
import PropTypes from 'prop-types';

import Header from '../header/header.jsx';
import Notifications from '../notifications/notifications.jsx';
import Modals from '../modals/modals.jsx';
import SubHeader from '../content-selector/sub-header.jsx';
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
        <div className="container">
          {this.props.children}
        </div>
        <Modals />
      </div>
    );
  }
}
