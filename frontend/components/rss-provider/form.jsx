import React from 'react';
import Form from 'react-bootstrap/lib/Form';

import * as FormFactory from '../form/factory.jsx';

export default class FormGenerator extends React.Component {

  static propTypes = FormFactory.getFormPropTypes()
  static defaultProps = FormFactory.getFormDefaultPropTypes()

  state = {
    record: this.props.record,
  }

  isInvalid = () => {
    const { record } = this.state;
    return !(FormFactory.validateLink(this, 'link') === 'success'
      && record.name);
  }

  onSaveClicked = (e) => {
    e.preventDefault();
    this.props.onSave(this.state.record);
  }

  onDeleteClicked = (e) => {
    e.preventDefault();
    this.props.onDelete(this.state.record);
  }

  render() {
    const { isNew } = this.props;
    const { record } = this.state;

    return (
      <Form horizontal>
        { !isNew && FormFactory.createStaticText(record._id, 'ID') }

        { FormFactory.createInput({
          name: 'name',
          value: record.name,
          onChange: FormFactory.handleInputChange(this),
          required: true
        }) }

        { FormFactory.createInputLink({
          name: 'link',
          value: record.link,
          onChange: FormFactory.handleInputChange(this),
          validate: FormFactory.validateLink(this, 'link'),
          required: true
        }) }

        { FormFactory.createFormOptionsPanel({
          onDelete: !isNew && this.onDeleteClicked,
          onSave: this.onSaveClicked,
          isInvalid: this.isInvalid(),
          isNew
        }) }
      </Form>
    );
  }
}
