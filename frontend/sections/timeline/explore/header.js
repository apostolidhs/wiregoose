import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import Header from '../../../components/timeline/header.js';
import tr from '../../../components/localization/localization.js';

export default class ExploreHeader extends React.Component {

  state = {}

  componentDidMount() {
    const isIndexPage = location.pathname === '/';
    this.setState({isIndexPage});
  }

  render() {
    return (
      <Header>
        <Nav bsStyle="pills" activeKey={1}>
          <LinkContainer to="/" active={this.state.isIndexPage}>
            <NavItem eventKey={1}>My Articles</NavItem>
          </LinkContainer>
          <LinkContainer to="/explore">
            <NavItem eventKey={2}>{tr.explore}</NavItem>
          </LinkContainer>
        </Nav>
      </Header>
    );
  }
}
