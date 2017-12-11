import _ from 'lodash';
import React from 'react';
import { Modal } from 'react-bootstrap';
import CSSModules from 'react-css-modules';

import styles from './modals.less';

let modalInstance;

export function attachModal(modalComponent, {closable} = {}) {
  return new Promise((resolve, reject) => {
    modalInstance.setState({
      modalComponent,
      closable,
      onClose: resolve
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
    onClose: _.noop
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

  onClose = () => {
    this.state.onClose();
    resetState();
  }

  render() {
    const {modalComponent, closable} = this.state;
    if (!modalComponent) {
      return null;
    }
    return (
      <Modal show={true}>
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
