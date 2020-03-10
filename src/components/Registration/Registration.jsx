import React from 'react';
import { reduxForm, Field, SubmissionError } from 'redux-form';
import { Button, Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import classes from './Registration.module.css';
import Input from '../Input/Input';
import * as actions from '../../store/actions';

const mapStateToProps = () => ({});

const actionCreators = {
  registration: actions.registration,
};

class Registration extends React.Component {
  submitHandler = async value => {
    const { reset, registration } = this.props;
    const { email, password } = value;
    try {
      await registration(email, password);
    } catch (e) {
      console.log('сервер не отвечает Registration');
      throw new SubmissionError({ _error: e.message });
    }
    reset();
  };

  render() {
    const { handleSubmit } = this.props;
    return (
      <div className={classes.RegContainer}>
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
          <Form.Group controlId="formBasicPassword">
            <Form.Label>Confirm password</Form.Label>
            <Field
              name="confirm"
              placeholder="Enter password"
              required
              component={Input}
              type="password"
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Registration
          </Button>
        </Form>
      </div>
    );
  }
}

const ConnectedAuthForm = connect(
  mapStateToProps,
  actionCreators
)(Registration);

export default reduxForm({
  form: 'RegistrationForm',
})(ConnectedAuthForm);
