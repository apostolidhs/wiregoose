import React from 'react';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';
import { Link } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, NavDropdown, NavItem, MenuItem } from 'react-bootstrap';

function mapStateToProps(state) {
  return { session: state.session };
}

@connect(mapStateToProps)
export default class Header extends React.Component {

  static propTypes = {
    session: React.PropTypes.shape({
      user: React.PropTypes.object,
      isRequesting: React.PropTypes.bool,
    }).isRequired,
  }

  render() {
    const { session } = this.props;
    return (
      <Navbar collapseOnSelect fixedTop>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/">Wiregoose</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav pullRight>
            {(() => {
              if (session && session.user) {
                return (
                  <NavItem eventKey={1}>
                    session.user.email
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
