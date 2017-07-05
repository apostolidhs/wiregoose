import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';

import styles from './loader.less';

@CSSModules(styles, {
  allowMultiple: true,
})
export default class Loader extends React.Component {

  state = {
    isLoading: false
  }

  static propTypes = {
    children: PropTypes.node,
  }

  set promise(prms) {
    const toggleLoading = _.debounce((isLoading = false) => {
      this.setState({ isLoading });
    }, 200);

    toggleLoading(true);
    prms.then((v) => {
      toggleLoading(false);
      return v;
    })
    .catch((e) => {
      toggleLoading(false);
      throw e;
    });
  }

  render() {
    return (
      <div styleName="wrapper">
        {this.props.children}
        {this.state.isLoading && <div styleName="loader">
          <div styleName="loader backdrop"></div>
          <div styleName="loader message-wrapper">
            <div styleName="message">
              <div styleName="bar-spinner">
                <div styleName="bar bar1"></div>
                <div styleName="bar bar2"></div>
                <div styleName="bar bar3"></div>
                <div styleName="bar bar4"></div>
                <div styleName="bar bar5"></div>
                <div styleName="bar bar6"></div>
                <div styleName="bar bar7"></div>
                <div styleName="bar bar8"></div>
                <div styleName="bar bar9"></div>
                <div styleName="bar bar10"></div>
                <div styleName="bar bar11"></div>
                <div styleName="bar bar12"></div>
              </div>
              <div styleName="text">Loading</div>
            </div>
          </div>
        </div>}
      </div>
    );
  }
}
