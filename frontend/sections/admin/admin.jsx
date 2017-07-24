import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Nav, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import FontAwesome from 'react-fontawesome';

export default class Admin extends React.Component {

  static propTypes = {
    children: PropTypes.node,
  }

  render() {
    return (
      <Row>
        <Col md={2}>
          <Nav bsStyle="pills" stacked activeKey={1}>
            <LinkContainer to="/admin/dashboard">
              <NavItem eventKey={1} title="Dashboard">
                <FontAwesome name="tachometer" /> Dashboard
              </NavItem>
            </LinkContainer>
            <LinkContainer to="/admin/rssprovider">
              <NavItem eventKey={1} title="RSS Provider">
                <FontAwesome name="address-card" /> RSS Provider
              </NavItem>
            </LinkContainer>
            <LinkContainer to="/admin/rssregistration">
              <NavItem eventKey={2} title="RSS Registration">
                <FontAwesome name="rss" /> RSS Registration
              </NavItem>
            </LinkContainer>
            <LinkContainer to="/admin/fetchreport">
              <NavItem eventKey={3} title="RSS Fetch Report">
                <FontAwesome name="flag" /> Fetch Report
              </NavItem>
            </LinkContainer>
            <LinkContainer to="/admin/articleentries">
              <NavItem eventKey={4} title="Article Entries">
                <FontAwesome name="font" /> Article Entries
              </NavItem>
            </LinkContainer>
            <LinkContainer to="/admin/article">
              <NavItem eventKey={5} title="Article">
                <FontAwesome name="newspaper-o" /> Article
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
