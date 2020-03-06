import React from 'react';
import { reduxForm, Field, SubmissionError } from 'redux-form';
import { connect } from 'react-redux';
import * as actions from '../../actions';

const mapStateToProps = state => {
  const props = {
    column1: state.columns.column1,
  };
  return props;
};

const actionCreators = { addTask: actions.addTask };

class NewTaskForm extends React.Component {
  handleSubmit = async values => {
    const { addTask, reset, column1 } = this.props;
    const task = { ...values };
    try {
      await addTask({ task, column1 });
    } catch (e) {
      throw new SubmissionError({ _error: e.message });
    }
    reset();
  };

  render() {
    const { handleSubmit } = this.props;
    return (
      <form onSubmit={handleSubmit(this.handleSubmit)} className="form-inline">
        <div className="form-group mx-3">
          <Field name="content" required component="input" type="text" />
        </div>
        <button type="submit" className="btn btn-primary btn-sm">
          Add task
        </button>
      </form>
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
