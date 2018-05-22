import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import { EventHOC } from '../../../components/events/events.js';
import Header from '../../../components/timeline/header.js';
import tr from '../../../components/localization/localization.js';
import * as Auth from '../../../components/authorization/auth.js';

class ExploreHeader extends React.Component {

  state = {}

  componentDidMount() {
    const isIndexPage = location.pathname === '/';
    this.setState({isIndexPage});
  }

  render() {
    const isAuthenticated = Auth.isAuthenticated();
    return (
      <div>
        <Header>
          <Nav bsStyle="pills" activeKey={1}>
            <LinkContainer to="/" active={this.state.isIndexPage}>
              <NavItem eventKey={1}>
                {isAuthenticated ? 'My Articles' : tr.explore}
              </NavItem>
            </LinkContainer>
            {isAuthenticated &&
              <LinkContainer to="/explore">
                <NavItem eventKey={2}>{tr.explore}</NavItem>
              </LinkContainer>
            }
          </Nav>
        </Header>
        {this.props.children}
      </div>
    );
  }
}

export default EventHOC(ExploreHeader, ['credentials']);
