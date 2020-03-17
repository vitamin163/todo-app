import React from 'react';
import {
  reduxForm,
  Field,
  SubmissionError,
  formValueSelector,
} from 'redux-form';
import { Button, Form, Spinner } from 'react-bootstrap';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import classes from './Auth.module.css';
import Input from '../Input/Input';
import * as actions from '../../store/actions';
import {
  validateForm,
  vaidateEmail,
  validatePassword,
  parseErrors,
} from '../../utils';
import ErrorAlert from '../ErrorAlert/ErrorAlert';

const getFormData = formValueSelector('authForm');

const mapStateToProps = state => ({
  userId: state.auth.userId,
  formValues: getFormData(state, 'email', 'password'),
  ui: state.ui,
});

const actionCreators = {
  login: actions.auth,
  authFailure: actions.authFailure,
};

class Auth extends React.Component {
  submitHandler = async value => {
    const { reset, login, authFailure } = this.props;
    const { email, password } = value;
    try {
      await login(email, password, 'login');
    } catch (e) {
      authFailure();
      const error = new SubmissionError({ ...e });
      const errorMessage = parseErrors(error, e);
      throw new SubmissionError({ _error: errorMessage });
    }
    reset();
  };

  render() {
    const {
      handleSubmit,
      submitting,
      pristine,
      formValues,
      error,
      ui: { authState },
    } = this.props;
    const { email, password } = formValues;
    const isValidEmail = vaidateEmail(email);
    const isValidPassword = validatePassword(password);
    const isValidInputs = !isValidEmail && !isValidPassword;
    const isValidForms = validateForm(isValidInputs, email, password);
    return (
      <>
        <div className={classes.AppName}>
          <strong>
            <h1>ToDo</h1>
          </strong>
        </div>
        <div className={classes.PageName}>
          <h2>Authorization</h2>
        </div>
        <div className={classes.AuthContainer}>
          <Form
            validated={isValidForms}
            onSubmit={handleSubmit(this.submitHandler)}
          >
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Field
                name="email"
                placeholder="Enter email"
                required
                component={Input}
                type="email"
                isInvalid={isValidEmail}
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
                isInvalid={isValidPassword}
              />
            </Form.Group>
            <div className={classes.ButtonContainer}>
              <Button
                disabled={submitting || pristine || !isValidForms}
                onClick={this.handleLogin}
                variant="primary"
                type="submit"
              >
                Sign in
              </Button>
              <NavLink to="/registration">
                <Button variant="primary">Registration</Button>
              </NavLink>
            </div>
            {authState === 'failure' && (
              <ErrorAlert processName="authState">{error}</ErrorAlert>
            )}
            {submitting && <Spinner animation="grow" variant="dark" />}
          </Form>
        </div>
      </>
    );
  }
}

const ConnectedAuthForm = connect(mapStateToProps, actionCreators)(Auth);

export default reduxForm({
  form: 'authForm',
})(ConnectedAuthForm);
