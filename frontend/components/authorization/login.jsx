import React from 'react';
import PropTypes from 'prop-types';
// import FontAwesome from 'react-fontawesome';
import { Form, FormGroup, Col, FormControl, ControlLabel, Button }
  from 'react-bootstrap';

export default class Login extends React.Component {

  static propTypes = {
    onLoginClicked: PropTypes.func.isRequired,
  }

  state = {
    email: '',
    password: '',
  };

  onValueChanged = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleLoginClicked = (e) => {
    e.preventDefault();
    this.props.onLoginClicked(this.state.email, this.state.password);
  }

  render() {
    return (
      <Form horizontal onSubmit={this.handleLoginClicked}>
        <FormGroup controlId="formHorizontalEmail">
          <Col componentClass={ControlLabel} sm={2}>
            Email
          </Col>
          <Col sm={10}>
            <FormControl
              type="text"
              name="email"
              placeholder="Email"
              onChange={this.onValueChanged}
            />
          </Col>
        </FormGroup>

        <FormGroup controlId="formHorizontalPassword">
          <Col componentClass={ControlLabel} sm={2}>
            Password
          </Col>
          <Col sm={10}>
            <FormControl
              type="password"
              name="password"
              placeholder="Password"
              onChange={this.onValueChanged}
            />
          </Col>
        </FormGroup>

        <FormGroup>
          <Col smOffset={2} sm={10}>
            <Button type="submit">
              Sign in
            </Button>
          </Col>
        </FormGroup>
      </Form>
    );
  }
}
