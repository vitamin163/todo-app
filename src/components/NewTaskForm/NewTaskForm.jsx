import React from 'react';
import { reduxForm, Field, SubmissionError } from 'redux-form';
import { connect } from 'react-redux';
import { Button, Form } from 'react-bootstrap';
import * as actions from '../../store/actions';
import Input from '../Input/Input';
import classes from './NewTaskForm.module.css';

const mapStateToProps = state => {
  const props = {
    column1: state.users.columns.column1,
    userId: state.auth.userId,
    form: state.form,
  };
  return props;
};

const actionCreators = { addTask: actions.addTask };

class NewTaskForm extends React.Component {
  handleSubmit = async values => {
    const { addTask, reset, column1, userId } = this.props;
    const task = { ...values };
    try {
      await addTask({ task, column1, userId });
    } catch (e) {
      console.log('сервер не отвеает');
      throw new SubmissionError({ _error: e.message });
    }
    reset();
  };

  render() {
    const { handleSubmit, submitting, pristine } = this.props;
    return (
      <Form
        className={classes.NewTaskForm}
        onSubmit={handleSubmit(this.handleSubmit)}
        inline
      >
        <Field
          name="content"
          type="text"
          component={Input}
          placeholder="add task"
        />
        <Button
          className={classes.NewTaskFormButton}
          type="submit"
          variant="info"
          disabled={pristine || submitting}
        >
          Add task
        </Button>
      </Form>
    );
  }
}
const ConnectedNewTaskForm = connect(
  mapStateToProps,
  actionCreators
)(NewTaskForm);

export default reduxForm({
  form: 'newTask',
})(ConnectedNewTaskForm);
