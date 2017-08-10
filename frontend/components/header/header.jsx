import _ from 'lodash';
import React from 'react';
import FontAwesome from 'react-fontawesome';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, NavDropdown, NavItem, MenuItem } from 'react-bootstrap';
import CSSModules from 'react-css-modules';

import tr from '../localization/localization.js';
import styles from './header.less';
import { SUPPORTED_LANGUAGES } from '../../config.js';
import * as Events from '../events/events.js';
import * as Auth from '../authorization/auth.js';

import logoImage from '../../assets/img/logo.png';

@CSSModules(styles, {
  allowMultiple: true,
})
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
    },
    lang: SUPPORTED_LANGUAGES[0]
  }

  componentWillMount() {
    Events.subscribe('sidebar', this.updateSidebarState);
    Events.subscribe('language', this.updateLanguageState);
  }

  componentWillUnmount() {
    Events.unsubscribe('sidebar', this.updateSidebarState);
    Events.unsubscribe('language', this.updateLanguageState);
  }

  updateSidebarState = (sidebar) => {
    this.setState({ sidebar })
  }

  updateLanguageState = (lang) => {
    this.setState({ lang })
  }

  toggleSidebarClicked = (evt) => {
    evt.preventDefault();
    this.state.sidebar.openLeftSidebarClicked();
  }

  changeLanguage = (lang) => {
    Auth.setSessionLang(lang);
    location.reload();
  }

  logout = (evt) => {
    evt.preventDefault();
    Auth.logout();
    location.reload();
  }

  render() {
    const { enableAuth } = this.props;
    const { isLeftSidebarEnabled, isLeftSidebarOpen } = this.state.sidebar;
    const otherLanguages = _.without(SUPPORTED_LANGUAGES, Auth.getSessionLang());
    return (
      <Navbar collapseOnSelect fixedTop>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/" styleName="logo">
              <img src={logoImage} />
              <span>Wiregoose</span>
            </Link>
          </Navbar.Brand>
        </Navbar.Header>

        { isLeftSidebarEnabled && (
          <Nav>
            <NavItem eventKey={1} href="#" active={isLeftSidebarOpen} onClick={this.toggleSidebarClicked}>sidebar</NavItem>
          </Nav>
        )}
        {/* <Navbar.Collapse> */}
          <Nav className="navigation-menu" pullRight>

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

            <NavDropdown
              onSelect={this.changeLanguage}
              eventKey={3}
              title={Auth.getSessionLang()}
              id="w-menu-language"
              noCaret
            >
            {_.map(otherLanguages, lang => (
              <MenuItem eventKey={lang} key={lang} >{lang}</MenuItem>
            ))}
            </NavDropdown>

            <NavDropdown
                eventKey={4}
                title={<FontAwesome name="bars" />}
                id="w-menu-settings"
                noCaret
              >
              { !Auth.isAdmin() &&
               <LinkContainer to="/info/providers">
                <MenuItem>
                  {tr.infoProviderTitle}
                </MenuItem>
              </LinkContainer>
              }
              { !Auth.isAdmin() &&
               <LinkContainer to="/info/about">
                <MenuItem>
                  {tr.infoAboutTitle}
                </MenuItem>
              </LinkContainer>
              }
              { !Auth.isAdmin() &&
               <LinkContainer to="/info/credits">
                <MenuItem>
                  {tr.infoCreatorsTitle}
                </MenuItem>
              </LinkContainer>
              }
              { Auth.isAdmin() &&
                <LinkContainer to="/admin.html" target="_blank">
                  <MenuItem>
                    Admin
                  </MenuItem>
                </LinkContainer>
              }
              { Auth.isAdmin() &&
                <MenuItem divider />
              }
              { Auth.isAdmin() &&
                <MenuItem onClick={this.logout}>
                  Logout
                </MenuItem>
              }
            </NavDropdown>

          </Nav>
        {/* </Navbar.Collapse> */}


      </Navbar>
    );
  }
}
