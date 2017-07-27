import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';

import styles from './header.less';

@CSSModules(styles, {
  allowMultiple: true,
})
export default class Header extends React.Component {

  static propTypes = {
    children: PropTypes.node,
  }

  render() {
    return (
      <div styleName="header">
        {this.props.children}
      </div>
    );
  }
}
