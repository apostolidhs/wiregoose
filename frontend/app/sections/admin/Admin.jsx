import React from 'react';
import { Row, Col, Nav, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

export default class Admin extends React.Component {

  static propTypes = {
    children: React.PropTypes.node,
  }

  render() {
    return (
      <Row>
        <Col md={3}>
          <Nav bsStyle="pills" stacked activeKey={1}>
            <LinkContainer to="admin/rssprovider">
              <NavItem eventKey={1} title="rssProvider">
                rssProvider
              </NavItem>
            </LinkContainer>
          </Nav>
        </Col>
        <Col md={9}>
          {this.props.children}
        </Col>
      </Row>
    );
  }

}
