import React from 'react';
import {
  reduxForm,
  Field,
  SubmissionError,
  formValueSelector,
} from 'redux-form';
import { Button, Form, Spinner } from 'react-bootstrap';
import { connect } from 'react-redux';
import {
  validateForm,
  vaidateEmail,
  validatePassword,
  parseErrors,
} from '../../utils';
import classes from './Registration.module.css';
import Input from '../Input/Input';
import * as actions from '../../store/actions';
import ErrorAlert from '../ErrorAlert/ErrorAlert';

const getFormData = formValueSelector('RegistrationForm');

const mapStateToProps = state => {
  const formValues = getFormData(state, 'email', 'password', 'confirm');
  const props = {
    formValues,
    ui: state.ui,
  };
  return props;
};

const actionCreators = {
  registration: actions.auth,
  registrationFailure: actions.registrationFailure,
};

class Registration extends React.Component {
  submitHandler = async value => {
    const { reset, registration, registrationFailure } = this.props;
    const { email, password } = value;
    try {
      await registration(email, password, 'registration');
    } catch (e) {
      registrationFailure();
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
      ui: { registrationState },
    } = this.props;
    const { email, password, confirm } = formValues;
    const isValidEmail = vaidateEmail(email);
    const isValidPassword = validatePassword(password);
    const isConfirmed = password === confirm;
    const isValidInputs = !isValidEmail && !isValidPassword && isConfirmed;
    const isValidForms = validateForm(isValidInputs, email, password, confirm);
    return (
      <>
        <div className={classes.PageName}>
          <h2>Registration</h2>
        </div>
        <div className={classes.RegContainer}>
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
            <Form.Group controlId="formBasicConfirmPassword">
              <Form.Label>Confirm password</Form.Label>
              <Field
                name="confirm"
                placeholder="Confirm password"
                required
                component={Input}
                type="password"
                isInvalid={!isConfirmed}
              />
            </Form.Group>
            <Button
              disabled={submitting || pristine || !isValidForms}
              variant="primary"
              type="submit"
            >
              Registration
            </Button>
          </Form>
          {registrationState === 'failure' && (
            <ErrorAlert processName="registrationState">{error}</ErrorAlert>
          )}
          {submitting && <Spinner animation="grow" variant="dark" />}
        </div>
      </>
    );
  }
}

export default connect(
  mapStateToProps,
  actionCreators
)(
  reduxForm({
    form: 'RegistrationForm',
  })(Registration)
);
