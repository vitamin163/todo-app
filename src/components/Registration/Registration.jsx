import React from 'react';
import {
  reduxForm,
  Field,
  SubmissionError,
  formValueSelector,
} from 'redux-form';
import { Button, Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import { validateForm, vaidateEmail, validatePassword } from '../../utils';
import classes from './Registration.module.css';
import Input from '../Input/Input';
import * as actions from '../../store/actions';

const getFormData = formValueSelector('RegistrationForm');

const mapStateToProps = state => {
  const formValues = getFormData(state, 'email', 'password', 'confirm');
  const props = {
    formValues,
  };
  return props;
};

const actionCreators = {
  registration: actions.auth,
};

class Registration extends React.Component {
  submitHandler = async value => {
    const { reset, registration } = this.props;
    const { email, password } = value;
    try {
      await registration(email, password, 'registration');
    } catch (e) {
      console.log('сервер не отвечает');
      throw new SubmissionError({ _error: e.message });
    }
    reset();
  };

  render() {
    const { handleSubmit, submitting, pristine, formValues } = this.props;
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
