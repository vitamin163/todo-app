import React from 'react';
import { connect } from 'react-redux';
import { Draggable } from 'react-beautiful-dnd';
import * as actions from '../../store/actions';
import classes from './Task.module.css';
import ButtonRemove from '../ButtonRemove/ButtonRemove';

const mapStateToProps = state => {
  const props = {
    userId: state.auth.userId,
    columns: state.users.columns,
    ui: state.ui,
  };
  return props;
};

const actionCreators = { removeTask: actions.removeTask };

class Task extends React.Component {
  handleRemove = (taskId, column) => async () => {
    const { removeTask, userId } = this.props;
    await removeTask({ taskId, column, userId });
  };

  render() {
    const { task, index, column } = this.props;
    return (
      <Draggable draggableId={String(task.id)} index={index}>
        {provided => (
          <div
            className={classes.Task}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            {task.content}
            <ButtonRemove onClick={this.handleRemove(task.id, column)} />
          </div>
        )}
      </Draggable>
    );
  }
}

export default connect(mapStateToProps, actionCreators)(Task);
