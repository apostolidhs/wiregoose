
import React from 'react';
import Modal from 'react-bootstrap/lib/Modal';
import { browserHistory } from 'react-router';

import ContentSelectorWrapper from './content-selector-wrapper.js';
import componentSize from '../responsible/component-size.js';
import { attachModal, detachModal } from '../modals/modals.js';

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

  return attachModal(
    <Modal.Body>
      <ContentSelectorWrapper {...props} inModal />
    </Modal.Body>,
    opts
  );
}
