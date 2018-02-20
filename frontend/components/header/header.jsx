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
  allowMultiple: true
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
    const displayMobile = componentSize.sizeFormatter({
      xxs: true,
      xs: true,
    }, false)(window.innerWidth);
    this.setState({displayMobile});
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
    const nextLang = otherLanguages[0]; // only en, gr :)
    const {showLogin} = this.state;

    return (
      <Navbar collapseOnSelect fixedTop>

        {this.state.displayMobile &&
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
              Wiregoose
            </Link>
          </Navbar.Brand>
        </Navbar.Header>

        <Nav className="navigation-menu" pullRight>

          {!Auth.isAuthenticated() && showLogin &&
            <NavItem eventKey={1} onSelect={Auth.launchAuthModal} styleName="header-sign-in">
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
                  <FontAwesome name="bookmark" />
                  {tr.bookmarksTitle}
                </MenuItem>
              </LinkContainer>
            }
            { Auth.isAuthenticated() &&
              <MenuItem divider />
            }
            <LinkContainer to="/info/providers">
              <MenuItem>
                <FontAwesome name="address-card" />
                {tr.infoProviderTitle}
              </MenuItem>
            </LinkContainer>
            <LinkContainer to="/info/about">
              <MenuItem>
                <FontAwesome name="info-circle" />
                {tr.infoAboutTitle}
              </MenuItem>
            </LinkContainer>
            <LinkContainer to="/info/credits">
              <MenuItem>
                <FontAwesome name="edit" />
                {tr.infoCreatorsTitle}
              </MenuItem>
            </LinkContainer>
            { Auth.isAdmin() &&
              <MenuItem divider />
            }
            { Auth.isAdmin() &&
              <LinkContainer to="/admin.html" target="_blank">
                <MenuItem>
                  <FontAwesome name="cog" />
                  Admin
                </MenuItem>
              </LinkContainer>
            }
            <MenuItem divider />
            {
              <MenuItem
                eventKey={nextLang}
                onSelect={this.changeLanguage}
                title={currentLanguage}
              >
                <FontAwesome name="globe" />
                {tr[nextLang]}
              </MenuItem>
            }
            { Auth.isAuthenticated() &&
              <MenuItem divider />
            }
            { Auth.isAuthenticated() &&
              <MenuItem onClick={this.logout}>
                <FontAwesome name="sign-out" />
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
