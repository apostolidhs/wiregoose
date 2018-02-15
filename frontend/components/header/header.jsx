import _ from 'lodash';
import React from 'react';
import FontAwesome from 'react-fontawesome';
import PropTypes from 'prop-types';
import { Link, browserHistory } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, NavDropdown, NavItem, MenuItem } from 'react-bootstrap';
import CSSModules from 'react-css-modules';

import tr from '../localization/localization.js';
import styles from './header.less';
import { SUPPORTED_LANGUAGES } from '../../../config-public.js';
import * as Events from '../events/events.jsx';
import * as Auth from '../authorization/auth.js';
import BrowserLanguageDetection from '../utilities/browser-language-detection.js';
import UserAvatar from '../user/avatar.jsx';
import componentSize from '../responsible/component-size.js';
import {launch as launchContentSelectorModal} from '../content-selector/content-selector-modal.jsx';

import logoImage from '../../assets/img/logo.png';

@CSSModules(styles, {
  allowMultiple: true,
})
class Header extends React.Component {
  state = {
    lang: SUPPORTED_LANGUAGES[0],
    showLogin: true,
    categoriesButton: false
  }

  componentWillMount() {
    Events.subscribe('language', this.updateLanguageState);
    window.addEventListener('resize', this.onResize);
    this.shouldDisplayLogin();
    this.onResize();
  }

  componentWillUnmount() {
    Events.unsubscribe('language', this.updateLanguageState);
    window.removeEventListener('resize', this.onResize);
  }

  onResize = _.throttle(() => {
    const displayCategoriesButton = componentSize.sizeFormatter({
      xxs: true,
      xs: true,
    }, false)(window.innerWidth);
    this.setState({displayCategoriesButton});
  }, 200)

  shouldDisplayLogin() {
    const {pathname} = browserHistory.getCurrentLocation();
    if (_.startsWith(pathname, '/auth')) {
      this.setState({showLogin: false});
    } else if (!this.state.showLogin) {
      this.setState({showLogin: true});
    }
  }

  componentWillReceiveProps() {
    this.shouldDisplayLogin();
  }

  updateLanguageState = (lang) => {
    this.setState({ lang })
  }

  changeLanguage = (lang) => {
    Auth.setSessionLang(lang);
    location.reload();
  }

  logout = (evt) => {
    evt.preventDefault();
    Auth.logout();
  }

  render() {
    const currentLanguage = BrowserLanguageDetection();
    const otherLanguages = _.without(SUPPORTED_LANGUAGES, currentLanguage);
    const {showLogin} = this.state;

    return (
      <Navbar collapseOnSelect fixedTop styleName="navbar">

        {this.state.displayCategoriesButton &&
          <Nav className="navigation-menu" pullLeft>
            <NavItem styleName="header-categories-button" eventKey={1} onSelect={launchContentSelectorModal}>
              <FontAwesome name="bars" />
            </NavItem>
          </Nav>
        }

        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/" styleName="logo">
              <img alt="Wiregoose" src={logoImage} />
              <span>Wiregoose</span>
            </Link>
          </Navbar.Brand>
        </Navbar.Header>

        <Nav className="navigation-menu" pullRight>
          <NavDropdown
            onSelect={this.changeLanguage}
            eventKey={3}
            title={currentLanguage}
            id="w-menu-language"
            noCaret
          >
          {_.map(otherLanguages, lang => (
            <MenuItem eventKey={lang} key={lang} >{lang}</MenuItem>
          ))}
          </NavDropdown>

          {!Auth.isAuthenticated() && showLogin &&
            <NavItem eventKey={1} onSelect={Auth.launchAuthModal}>
              {tr.signIn}
            </NavItem>
          }

          <NavDropdown
            eventKey={4}
            title={Auth.isAuthenticated()
              ? <UserAvatar type="HEADER" isUser />
              : <FontAwesome name="ellipsis-v" />
            }
            id="w-menu-settings"
            noCaret
          >
          {/* <LinkContainer to="/profile"> */}
            { Auth.isAuthenticated() &&
              <MenuItem styleName="profile-item">
                <UserAvatar type="HEADER_DROPDOWN" isUser />
                <strong styleName="profile-content" >
                  {Auth.getSession().user.email}
                </strong>
              </MenuItem>
            }
            { Auth.isAuthenticated() &&
              <MenuItem divider />
            }
            { Auth.isAuthenticated() &&
              <LinkContainer to="/bookmarks">
                <MenuItem>
                  {tr.bookmarksTitle}
                </MenuItem>
              </LinkContainer>
            }
            { Auth.isAuthenticated() &&
              <MenuItem divider />
            }
            {/* { Auth.isAuthenticated() &&
              <LinkContainer to="/profile">
                <MenuItem>
                  {tr.profileTitle}
                </MenuItem>
              </LinkContainer>
            } */}
            <LinkContainer to="/info/providers">
              <MenuItem>
                {tr.infoProviderTitle}
              </MenuItem>
            </LinkContainer>
            <LinkContainer to="/info/about">
              <MenuItem>
                {tr.infoAboutTitle}
              </MenuItem>
            </LinkContainer>
            <LinkContainer to="/info/credits">
              <MenuItem>
                {tr.infoCreatorsTitle}
              </MenuItem>
            </LinkContainer>
            { Auth.isAdmin() &&
              <MenuItem divider />
            }
            { Auth.isAdmin() &&
              <LinkContainer to="/admin.html" target="_blank">
                <MenuItem>
                  Admin
                </MenuItem>
              </LinkContainer>
            }
            { Auth.isAuthenticated() &&
              <MenuItem divider />
            }
            { Auth.isAuthenticated() &&
              <MenuItem onClick={this.logout}>
                {tr.logout}
              </MenuItem>
            }
          </NavDropdown>
        </Nav>
      </Navbar>
    );
  }
}

export default Events.EventHOC(Header, ['credentials']);
