import _ from 'lodash';
import React from 'react';
import FontAwesome from 'react-fontawesome';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, NavDropdown, NavItem, MenuItem } from 'react-bootstrap';

import * as Events from '../events/events.js';
import * as Auth from '../authorization/auth.js';

export default class Header extends React.Component {
  static propTypes = {
    enableAuth: PropTypes.bool
  }

  static defaultProps = {
    enableAuth: true
  }

  state = {
    sidebar: {
      isLeftSidebarEnabled: false,
      isLeftSidebarOpen: false,
      openLeftSidebarClicked: _.noop
    }
  }

  componentWillMount() {
    Events.subscribe('sidebar', this.updateSidebarState);
  }

  componentWillUnmount() {
    Events.unsubscribe('sidebar', this.updateSidebarState);
  }

  updateSidebarState = (sidebar) => {
    this.setState({ sidebar })
  }

  toggleSidebarClicked = (evt) => {
    evt.preventDefault();
    this.state.sidebar.openLeftSidebarClicked();
  }

  render() {
    const { enableAuth } = this.props;
    const { isLeftSidebarEnabled, isLeftSidebarOpen } = this.state.sidebar;
    return (
      <Navbar collapseOnSelect fixedTop>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/">Wiregoose</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        { isLeftSidebarEnabled && (
          <Nav>
            <NavItem eventKey={1} href="#" active={isLeftSidebarOpen} onClick={this.toggleSidebarClicked}>sidebar</NavItem>
          </Nav>
        )}
        <Navbar.Collapse>
          <Nav pullRight>
            {enableAuth && (() => {
              if (Auth.isAuthenticated()) {
                return (
                  <NavItem eventKey={1}>
                    { Auth.getSession().user.email }
                  </NavItem>
                );
              } else {
                return (
                  <LinkContainer to="/login">
                    <NavItem eventKey={1} >
                      login
                    </NavItem>
                  </LinkContainer>
                );
              }
            })()}

            { enableAuth && Auth.isAdmin()  &&
              <LinkContainer to="/admin">
                <NavItem eventKey={1} >
                  admin
                </NavItem>
              </LinkContainer>
            }
            <NavDropdown
              eventKey={3}
              title={<FontAwesome name="bars" />}
              id="basic-nav-dropdown"
              noCaret
            >
              <LinkContainer to="/componentsGallery">
                <MenuItem>
                  Components Gallery
                </MenuItem>
              </LinkContainer>
              {/* <MenuItem divider />
              <MenuItem eventKey={3.3}>Separated link</MenuItem>*/}
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}
