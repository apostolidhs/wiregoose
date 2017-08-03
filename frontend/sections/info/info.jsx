import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap';
import CSSModules from 'react-css-modules';

import footerImage from '../../assets/img/option-menu-footer-bg.png';
import styles from './info.less';

@CSSModules(styles, {
  allowMultiple: true,
})
export default class Info extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    headerImg: PropTypes.string.isRequired
  }

  render() {
    return (
      <Row styleName="info">
        <Col md={8} mdOffset={2} >
          <img src={this.props.headerImg} />
          <section>
            {this.props.children}
          </section>
          <img src={footerImage} />
        </Col>
      </Row>
    );
  }
}
