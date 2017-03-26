import React from 'react';
// import FontAwesome from 'react-fontawesome';
import { Form, FormGroup, Col, FormControl, ControlLabel, Button }
  from 'react-bootstrap';

// function mapStateToProps(state) {
//   return { session: state.session };
// }

export default class Login extends React.Component {

  // static propTypes = {
  //   session: React.PropTypes.shape({
  //     user: React.PropTypes.object,
  //     isRequesting: React.PropTypes.bool,
  //   }).isRequired,
  // }

  state = {
    email: '',
    password: '',
  };

  onValueChanged = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    return (
      <Form horizontal>
        <FormGroup controlId="formHorizontalEmail">
          <Col componentClass={ControlLabel} sm={2}>
            Email
          </Col>
          <Col sm={10}>
            <FormControl
              type="email"
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
