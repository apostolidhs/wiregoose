import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import { Button } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

import styles from './header.less';
import tr from '../localization/localization.js';

@CSSModules(styles, {
  allowMultiple: true,
})
export default class Header extends React.Component {

  static propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func
  }

  render() {
    return (
      <div styleName="header">
        { this.props.onClose &&
          <Button bsStyle="link" onClick={this.props.onClose} styleName="closable-header" title={tr.trFa('close')} >
            <FontAwesome name="times-circle" />
          </Button>
        }
        {this.props.children}
      </div>
    );
  }
}
