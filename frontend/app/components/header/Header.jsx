import React from 'react';
import FontAwesome from 'react-fontawesome';
import { Navbar, Nav, NavDropdown, MenuItem } from 'react-bootstrap';

export default class Header extends React.Component {
  state = {}

  render() {
    return (
      <Navbar collapseOnSelect fixedTop>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="/">Wiregoose</a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav pullRight>
            {/* <NavItem eventKey={1} href="#">Link</NavItem>
            <NavItem eventKey={2} href="#">Link</NavItem>*/}
            <NavDropdown
              eventKey={3}
              title={<FontAwesome name="bars" />}
              id="basic-nav-dropdown"
              noCaret
            >
              <MenuItem eventKey={3.1}>Action</MenuItem>
              {/* <MenuItem divider />
              <MenuItem eventKey={3.3}>Separated link</MenuItem>*/}
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}
