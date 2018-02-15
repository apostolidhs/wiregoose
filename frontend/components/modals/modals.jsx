import _ from 'lodash';
import React from 'react';
import { Modal } from 'react-bootstrap';
import CSSModules from 'react-css-modules';

import styles from './modals.less';

let modalInstance;

export function attachModal(modalComponent, {closable, modalProps, outsideClick} = {}) {
  return new Promise((resolve, reject) => {
    modalInstance.setState({
      modalComponent,
      closable,
      onClose: resolve,
      modalProps,
      outsideClick
    });
  });
}

export function detachModal() {
  resetState();
}

function resetState() {
  if (!modalInstance.state.modalComponent) {
    return;
  }

  if (modalInstance.state.onClose) {
    modalInstance.state.onClose();
  }

  modalInstance.setState({
    modalComponent: null,
    closable: false,
    onClose: _.noop,
    modalProps: {},
    outsideClick: false
  });
}

@CSSModules(styles, {
  allowMultiple: true,
})
export default class Modals extends React.Component {

  state = {};

  constructor() {
    super();
    modalInstance = this;
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onGlobalClick);
  }

  componentDidUpdate() {
    const isOpen = !!this.state.modalComponent;
    if (isOpen && this.state.outsideClick) {
      document.addEventListener('click', this.onGlobalClick);
    } else if (!isOpen) {
      document.removeEventListener('click', this.onGlobalClick);
    }
  }

  onGlobalClick = evt => {
    if (!document.querySelector('.modal-content').contains(evt.target)) {
      this.onClose();
    }
  }

  onClose = () => {
    this.state.onClose();
    resetState();
  }

  render() {
    const {modalComponent, closable, modalProps} = this.state;
    if (!modalComponent) {
      return null;
    }
    return (
      <Modal ref={e => this.modelEl = e} show={true} {...(modalProps || {})} >
        {closable &&
          <button type="button" className="close" styleName="close" onClick={this.onClose}>
            <span aria-hidden="true">×</span>
            <span className="sr-only">Close</span>
          </button>
        }
        {modalComponent}
      </Modal>
    );
  }
}
