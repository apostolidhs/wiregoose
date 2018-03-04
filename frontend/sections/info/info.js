import React from 'react';
import PropTypes from 'prop-types';
import Col from 'react-bootstrap/lib/Col';
import CSSModules from 'react-css-modules';

import styles from './info.less';

@CSSModules(styles, {
  allowMultiple: true,
})
export default class Info extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    headerImg: PropTypes.string.isRequired,
    headerFooterImg: PropTypes.string.isRequired
  }

  render() {
    return (
      <div styleName="info">
        <img src={this.props.headerImg} alt="Wiregoose" />
        <div>
          <Col md={8} mdOffset={2} xs={10} xsOffset={1} >
            <section>
              {this.props.children}
            </section>
          </Col>
        </div>
        <img src={this.props.headerFooterImg} alt="Wiregoose" />
      </div>
    );
  }
}
