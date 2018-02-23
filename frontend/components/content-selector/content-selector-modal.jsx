import throttle from 'lodash/throttle';
import findLast from 'lodash/findLast';
import each from 'lodash/each';
import React from 'react';
import { Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import { browserHistory } from 'react-router';

import ContentSelector from './content-selector.jsx';
import componentSize from '../responsible/component-size.js';
import { attachModal, detachModal } from '../modals/modals.jsx';
import styles from './content-selector.less';

@CSSModules(styles, {
  allowMultiple: true,
})
export default class ContentSelectorModal extends React.Component {

  state = {headTitle: ''}

  componentDidMount() {
    this.headEls = Array.from(this.wrapperEl.querySelectorAll('h3[data-sticky-head]'));
    this.wrapperEl.addEventListener('scroll', this.handleOnScroll, true);
    this.handleOnScroll();
  }

  componentWillUnmount() {
    this.wrapperEl.removeEventListener('scroll', this.handleOnScroll, true);
    this.handleOnScroll.cancel();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.headTitle !== nextState.headTitle;
  }

  handleOnScroll = throttle(evt => {
    evt && evt.stopPropagation();
    const scrollTop = this.wrapperEl.scrollTop + 60;
    const stickyHeadEl = findLast(this.headEls, headEl => headEl.offsetTop < scrollTop) || this.headEls[0];
    const headTitle = stickyHeadEl.getAttribute('data-sticky-head');
    if (this.state.headTitle !== headTitle) {
      each(this.headEls, headEl => headEl.style.visibility = 'initial');
      this.headEls[0].style.display = 'none';
      stickyHeadEl.style.visibility = 'hidden';
      this.setState({headTitle});
    }
  }, 250)

  render() {
    const {headTitle} = this.state;
    return (
      <Modal.Body>
        <header styleName="header" >
          <h3>{headTitle}</h3>
        </header>
        <div styleName="modal-content-selector" ref={e => this.wrapperEl = e}>
          <ContentSelector {...this.props}/>
        </div>
      </Modal.Body>
    );
  }

}

function handleLinkClick(pathname) {
  browserHistory.push({pathname});
  detachModal();
}

export function launch() {
  const props = {
    onCategoryClick: category => handleLinkClick(`/category/${category}`),
    onProviderClick: provider => handleLinkClick(`/provider/${provider}`),
    onCategoryByProviderClick: registration => handleLinkClick(`/registration/${registration}`)
  };

  const modalProps = {
    onEnter: modalEl => {
      modalEl.querySelector('.modal-dialog').className = 'container container-modal';
      modalEl.style.top = componentSize.sizeFormatter({
        xxs: '50px',
        xs: '50px',
      }, '80px')(window.innerWidth);
    },
    keyboard: true
  }

  const opts = {
    closable: true,
    outsideClick: true,
    modalProps
  };
  return attachModal(<ContentSelectorModal {...props} />, opts);
}
