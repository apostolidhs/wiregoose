import React from 'react';
import PropTypes from 'prop-types';
// import FontAwesome from 'react-fontawesome';
import { Form, FormGroup, Col, FormControl, ControlLabel, Button }
  from 'react-bootstrap';

export default class CredentialForm extends React.Component {

  static propTypes = {
    onCredentialSubmit: PropTypes.func.isRequired,
    submitTitle: PropTypes.string.isRequired,
    hidePassword: PropTypes.bool
  }

  state = {
    email: '',
    password: '',
  };

  onValueChanged = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmitClicked = (e) => {
    e.preventDefault();
    this.props.onCredentialSubmit(this.state.email, this.state.password);
  }

  render() {
    const {
      hidePassword,
      submitTitle
    } = this.props;
    return (
      <Form onSubmit={this.handleSubmitClicked}>
        <FormGroup className="w-mb-7" controlId="formHorizontalEmail">
          <FormControl
            type="email"
            name="email"
            placeholder="Email"
            onChange={this.onValueChanged}
          />
        </FormGroup>
        {!hidePassword &&
          <FormGroup className="w-mb-14" controlId="formHorizontalPassword">
            <FormControl
              type="password"
              name="password"
              placeholder="Password"
              onChange={this.onValueChanged}
            />
          </FormGroup>
        }
        <FormGroup>
          <Button type="submit" bsStyle="primary" block>
            {submitTitle}
          </Button>
        </FormGroup>
      </Form>
    );
  }
}
