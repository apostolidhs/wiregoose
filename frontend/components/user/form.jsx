import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Form, FormGroup, Col, FormControl, ControlLabel, Button, Panel, Collapse }
  from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import CSSModules from 'react-css-modules';

import * as FormFactory from '../form/factory.jsx';
import { SUPPORTED_LANGUAGES } from '../../../config-public.js';

export default class ArticleForm extends React.Component {

  static USER_ROLES = ['FREE', 'USER', 'ADMIN'];

  static propTypes = FormFactory.getFormPropTypes()
  static defaultProps = FormFactory.getFormDefaultPropTypes()

  state = {
    record: this.props.record
  }

  isInvalid = () => {
    const { record } = this.state;
    return !(record.email
      && record.role
      && record.lang
    );
  }

  onSaveClicked = (e) => {
    e.preventDefault();
    this.props.onSave(this.state.record);
  }

  onDeleteClicked = (e) => {
    e.preventDefault();
    this.props.onDelete(this.state.record);
  }

  render () {
    const { isNew } = this.props;
    const { record } = this.state;

    return (
      <Form horizontal>

        { !isNew && FormFactory.createStaticText(record._id, 'ID') }

        { FormFactory.createInput({
          name: 'email',
          label: 'Email',
          type: 'email',
          value: record.email,
          onChange: FormFactory.handleInputChange(this),
          required: true
        }) }

        { FormFactory.createInputDate({
          name: 'lastLogin',
          label: 'Last login',
          value: record.lastLogin,
          onChange: FormFactory.handleDateInputChange(this, 'lastLogin'),
          required: true
        }) }

        { FormFactory.createInput({
          name: 'totalLogins',
          label: 'Total logins',
          type: 'number',
          value: record.totalLogins,
          onChange: FormFactory.handleInputChange(this),
          required: true
        }) }

        { !record.isEmailValid && FormFactory.createInputDate({
          name: 'validationExpiresAt',
          label: 'Account expires',
          value: record.validationExpiresAt,
          onChange: FormFactory.handleDateInputChange(this, 'validationExpiresAt')
        }) }

        { record.isEmailValid && FormFactory.createStaticText(
          <FontAwesome className='text-success' name="check" />,
          'Account validation'
        ) }

        { FormFactory.createSelection({
          name: 'role',
          value: record.role,
          onChange: FormFactory.handleInputChange(this),
          enumeration: ArticleForm.USER_ROLES,
          required: true
        }) }

        { FormFactory.createSelection({
          name: 'lang',
          value: record.lang,
          onChange: FormFactory.handleInputChange(this),
          enumeration: SUPPORTED_LANGUAGES,
          required: true
        }) }

        { FormFactory.createFormOptionsPanel({
          onDelete: !isNew && this.onDeleteClicked,
          onSave: this.onSaveClicked,
          isInvalid: this.isInvalid(),
          isNew
        }) }

      </Form>
    )
  }

}
