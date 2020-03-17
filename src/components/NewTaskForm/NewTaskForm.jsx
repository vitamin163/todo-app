import React from 'react';
import { reduxForm, Field, SubmissionError } from 'redux-form';
import { connect } from 'react-redux';
import { Button, Form } from 'react-bootstrap';
import * as actions from '../../store/actions';
import Input from '../Input/Input';
import classes from './NewTaskForm.module.css';
import ErrorAlert from '../ErrorAlert/ErrorAlert';

const mapStateToProps = state => {
  const props = {
    column1: state.users.columns.column1,
    userId: state.auth.userId,
    form: state.form,
    ui: state.ui,
  };
  return props;
};

const actionCreators = {
  addTask: actions.addTask,
  addTaskFailure: actions.addTaskFailure,
};

class NewTaskForm extends React.Component {
  handleSubmit = async values => {
    const { addTask, reset, column1, userId, addTaskFailure } = this.props;
    const task = { ...values };
    try {
      await addTask({ task, column1, userId });
    } catch (e) {
      addTaskFailure();
      throw new SubmissionError({ _error: e.message });
    }
    reset();
  };

  render() {
    const {
      handleSubmit,
      submitting,
      pristine,
      error,
      ui: { addTaskState },
    } = this.props;
    return (
      <div className={classes.NewTaskForm}>
        <Form onSubmit={handleSubmit(this.handleSubmit)} inline>
          <div className={classes.ControlPanel}>
            <Field
              name="content"
              type="text"
              component={Input}
              placeholder="add task"
            />
            <Button
              type="submit"
              variant="info"
              disabled={pristine || submitting}
            >
              Add task
            </Button>
          </div>
        </Form>
        <div className={classes.Error}>
          {addTaskState === 'failure' && (
            <ErrorAlert processName="addTaskState">{error}</ErrorAlert>
          )}
        </div>
      </div>
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
