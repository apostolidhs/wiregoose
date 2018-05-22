import map from 'lodash/map';
import React from 'react';
import {findDOMNode} from 'react-dom';
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
import {launch} from './content-selector-modal.js';
import styles from './content-selector.less';
import CategoryImages from '../category/images.js';

@CSSModules(styles, {
  allowMultiple: true,
})
export default class SubHeader extends React.Component {

  static SCROLL_OFFSET = 200;

  state = {};

  componentDidMount() {
    this.calculateArrowsVisibility();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.showLeft !== nextState.showLeft
      || this.state.showRight !== nextState.showRight;
  }

  openContentSelectorModal = () => {
    launch();
  }

  scrollRight = () => {
    this.catsWrapperEl.scrollLeft += SubHeader.SCROLL_OFFSET;
    this.calculateArrowsVisibility();
  }

  scrollLeft = () => {
    this.catsWrapperEl.scrollLeft = Math.max(
      this.catsWrapperEl.scrollLeft - SubHeader.SCROLL_OFFSET,
      0
    );
    this.calculateArrowsVisibility();
  }

  calculateArrowsVisibility() {
    const catRect = this.catsEl.getBoundingClientRect();
    const leftRect = this.leftEl.getBoundingClientRect();
    const rightRect = this.rightEl.getBoundingClientRect();
    const menuRect = this.menuEl.getBoundingClientRect();

    const showRight = rightRect.left + 50 < catRect.right;
    this.setState({showRight});

    const showLeft = menuRect.width + catRect.left + 20 < leftRect.left;
    this.setState({showLeft});
  }

  render() {
    return (
      <div className="container">
        <Navbar styleName="sub-header-nav">
          <div ref={e => this.catsWrapperEl = e} styleName="sub-header-nav-categories-wrapper">
            <Nav ref={e => this.catsEl = findDOMNode(e)}>
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
          <Nav pullRight ref={e => this.menuEl = findDOMNode(e)} styleName="sub-header-nav-more">
            <NavItem eventKey={20} title={tr.categories} onSelect={this.openContentSelectorModal} >
              <FontAwesome name="bars" />
              {' '}
              {tr.categories}
            </NavItem>
          </Nav>
          <Nav pullLeft ref={e => this.leftEl = findDOMNode(e)} style={{visibility: this.state.showLeft ? '' : 'hidden'}} styleName="sub-header-nav-left">
            <NavItem eventKey={21} title={'more'} onSelect={this.scrollLeft} >
              <FontAwesome name="chevron-left" />
            </NavItem>
          </Nav>
          <Nav pullLeft ref={e => this.rightEl = findDOMNode(e)} style={{visibility: this.state.showRight ? '' : 'hidden'}} styleName="sub-header-nav-right">
            <NavItem eventKey={22} title={'more'} onSelect={this.scrollRight} >
              <FontAwesome name="chevron-right" />
            </NavItem>
          </Nav>
        </Navbar>
      </div>
    );
  }
}
