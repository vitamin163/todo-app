import React from 'react';
import _ from 'lodash';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import * as actions from '../../actions';


const mapStateToProps = () => {
  const props = {};
  return props;
};

const actionCreators = { addTask: actions.addTask };

class NewTaskForm extends React.Component {
  handleSubmit = (values) => {
    const { addTask, reset } = this.props;
    const task = { ...values, id: _.uniqueId() };
    addTask({ task });
    reset();
  }

  render() {
    const { handleSubmit } = this.props;
    /* функцию handleSubmit прокидывает redux-form,
    она передаст в мой обработчик объект(где свойство — это name элемента Field)
    со всеми значениями из формы */
    return (
      <form onSubmit={handleSubmit(this.handleSubmit)} className="form-inline">
        <div className="form-group mx-3">
          <Field name="content" required component="input" type="text" />
        </div>
        <button type="submit" className="btn btn-primary btn-sm">Add task</button>
      </form>
    );
  }
}
const ConnectedNewTaskForm = connect(mapStateToProps, actionCreators)(NewTaskForm);

export default reduxForm({
  form: 'newTask',
})(ConnectedNewTaskForm);
