import _ from 'lodash';
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
    this.wrapperEl.addEventListener('scroll', this.handleOnScroll, true);
    this.handleOnScroll();
  }

  componentWillUnmount() {
    this.wrapperEl.removeEventListener('scroll', this.handleOnScroll, true);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.headTitle !== nextState.headTitle;
  }

  handleOnScroll = _.throttle(evt => {
    evt && evt.stopPropagation();
    const scrollTop = this.wrapperEl.scrollTop + 60;
    const headEls = Array.from(this.wrapperEl.querySelectorAll('h3[data-sticky-head]'));
    const stickyHeadEl = _.findLast(headEls, headEl => headEl.offsetTop < scrollTop) || headEls[0];
    _.each(headEls, headEl => headEl.style.visibility = 'initial');
    stickyHeadEl.style.visibility = 'hidden';
    const headTitle = stickyHeadEl.getAttribute('data-sticky-head');
    this.setState({headTitle});
  }, 250)

  render() {
    const {headTitle} = this.state;
    return (
      <Modal.Body>
        <header styleName="header" >
          <h3>{headTitle}</h3>
        </header>
        <div styleName="modal-content-selector" ref={e => this.wrapperEl = e}>
          <ContentSelector {...this.props} />
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
