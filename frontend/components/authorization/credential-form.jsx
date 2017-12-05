import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
// import FontAwesome from 'react-fontawesome';
import { Form, FormGroup, Col, FormControl, ControlLabel, Button, HelpBlock }
  from 'react-bootstrap';
import tr from '../localization/localization.js';

export default class CredentialForm extends React.Component {

  static propTypes = {
    onCredentialSubmit: PropTypes.func.isRequired,
    submitTitle: PropTypes.string.isRequired,
    hidePassword: PropTypes.bool,
    errors: PropTypes.any
  }

  static defaultProps = {
    errors: {},
    hidePassword: false
  }

  state = {
    email: '',
    password: '',
    errors: {}
  };

  componentWillReceiveProps({errors}) {
    this.setState({errors});
  }

  onValueChanged = (e) => {
    const name = e.target.name;
    const {errors} = this.state;
    this.setState({
      [name]: e.target.value,
      errors: _.omit(errors, [name])
    });
  }

  handleSubmitClicked = (e) => {
    e.preventDefault();
    const {hidePassword} = this.props;
    const {email, password} = this.state;
    const errors = {};
    if (!email) {
      errors.email = tr.invalidEmail;
    }
    if (!hidePassword && !(password && password.length >= 6)) {
      errors.password = tr.formatString(tr.invalidPassword, 6).join('');
    }

    if (!_.isEmpty(errors)) {
      this.setState({errors});
      return;
    }

    this.props.onCredentialSubmit(email, password);
  }

  render() {
    const {
      hidePassword,
      submitTitle
    } = this.props;

    const {errors} = this.state;
    return (
      <Form onSubmit={this.handleSubmitClicked}>
        <FormGroup className="w-mb-7" controlId="formHorizontalEmail" validationState={errors.email && 'error'}>
          <FormControl
            type="email"
            name="email"
            placeholder="Email"
            className="w-minimal"
            onChange={this.onValueChanged}
            autoFocus
            required
          />
          {errors.email &&
            <HelpBlock>
              <small>{errors.email}</small>
            </HelpBlock>
          }
        </FormGroup>
        {!hidePassword &&
          <FormGroup className="w-mb-14" controlId="formHorizontalPassword" validationState={errors.password && 'error'}>
            <FormControl
              type="password"
              name="password"
              placeholder="Password"
              className="w-minimal"
              onChange={this.onValueChanged}
              required
            />
            {errors.password &&
              <HelpBlock>
                <small>{errors.password}</small>
              </HelpBlock>
            }
          </FormGroup>
        }
        <FormGroup className="w-m-0 w-pt-7">
          <Button type="submit" bsStyle="primary" block>
            {submitTitle}
          </Button>
        </FormGroup>
      </Form>
    );
  }
}
