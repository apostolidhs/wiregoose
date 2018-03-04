import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';

import styles from './timeline.less';

@CSSModules(styles, {
  allowMultiple: true
})
export default class Timeline extends React.Component {

  static propTypes = {
    children: PropTypes.node.isRequired
  }

  render() {
    const { children } = this.props;
    return (
      <div styleName="container-wrapper" >
        <div className="container" >
          {children}
        </div>
      </div>
    );
  }

}
