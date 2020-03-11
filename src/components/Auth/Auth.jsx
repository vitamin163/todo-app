import React from 'react';
import { reduxForm, Field, SubmissionError } from 'redux-form';
import { Button, Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import classes from './Auth.module.css';
import Input from '../Input/Input';
import * as actions from '../../store/actions';

const mapStateToProps = () => ({});

const actionCreators = {
  login: actions.login,
};

class Auth extends React.Component {
  submitHandler = async value => {
    const { reset, login } = this.props;
    const { email, password } = value;
    try {
      await login(email, password);
    } catch (e) {
      console.log('Ошибка доступа Auth');
      throw new SubmissionError({ _error: e.message });
    }
    reset();
  };

  render() {
    const { handleSubmit } = this.props;

    return (
      <div className={classes.AuthContainer}>
        <Form onSubmit={handleSubmit(this.submitHandler)}>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Field
              name="email"
              placeholder="Enter email"
              required
              component={Input}
              type="email"
            />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Field
              name="password"
              placeholder="Enter password"
              required
              component={Input}
              type="password"
            />
          </Form.Group>
          <div className={classes.ButtonContainer}>
            <Button onClick={this.handleLogin} variant="primary" type="submit">
              Sign in
            </Button>
            <NavLink to="/registration">
              <Button variant="primary">Registration</Button>
            </NavLink>
          </div>
        </Form>
      </div>
    );
  }
}

const ConnectedAuthForm = connect(mapStateToProps, actionCreators)(Auth);

export default reduxForm({
  form: 'authForm',
})(ConnectedAuthForm);