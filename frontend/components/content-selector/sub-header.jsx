import map from 'lodash/map';
import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/lib/Button';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import { LinkContainer } from 'react-router-bootstrap';
import FontAwesome from 'react-fontawesome';
import CSSModules from 'react-css-modules';

import {CATEGORIES} from '../../../config-public.js';
import tr from '../localization/localization.js';
import {launch} from './content-selector-modal.jsx';
import styles from './content-selector.less';
import CategoryImages from '../category/images.jsx';

@CSSModules(styles, {
  allowMultiple: true,
})
export default class SubHeader extends React.Component {

  openContentSelectorModal = () => {
    launch();
  }

  render() {
    return (
      <div className="container">
        <Navbar styleName="sub-header-nav">
          <div styleName="sub-header-nav-categories-wrapper">
            <Nav>
            {map(CATEGORIES, (cat, idx) =>
              <LinkContainer key={cat} to={`/category/${cat}`}>
                <NavItem styleName="sub-header-nav-categories-item" title={tr[cat]} eventKey={idx} href="#">
                  {<CategoryImages name={cat} />}
                  {' '}
                  {tr[cat]}
                </NavItem>
              </LinkContainer>
            )}
            </Nav>
          </div>
          <Nav pullRight styleName="sub-header-nav-more">
            <NavItem eventKey={20} title={tr.categories} onSelect={this.openContentSelectorModal} >
              <FontAwesome name="bars" />
              {' '}
              {tr.categories}
            </NavItem>
          </Nav>
        </Navbar>
      </div>
    );
  }
}
