import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Nav, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

export default class Admin extends React.Component {

  static propTypes = {
    children: PropTypes.node,
  }

  render() {
    return (
      <Row>
        <Col md={2}>
          <Nav bsStyle="pills" stacked activeKey={1}>
            <LinkContainer to="admin/rssprovider">
              <NavItem eventKey={1} title="RSS Provider">
                RSS Provider
              </NavItem>
            </LinkContainer>
            <LinkContainer to="admin/rssregistration">
              <NavItem eventKey={1} title="RSS Registration">
                RSS Registration
              </NavItem>
            </LinkContainer>
          </Nav>
        </Col>
        <Col md={10}>
          {this.props.children}
        </Col>
      </Row>
    );
  }

}
