import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Draggable } from 'react-beautiful-dnd';
import * as actions from '../../store/actions';
import classes from './Task.module.css';

const mapStateToProps = () => ({});

const actionCreators = { removeTask: actions.removeTask };

class Task extends React.Component {
  handleRemove = (taskId, column) => async () => {
    const { removeTask } = this.props;
    const { taskIds } = column;
    const updateTaskIds = _.without(taskIds, taskId);
    const updateColumn = { ...column, taskIds: updateTaskIds };
    await removeTask({ id: taskId, column: updateColumn });
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
            <button onClick={this.handleRemove(task.id, column)} type="button">
              &times;
            </button>
          </div>
        )}
      </Draggable>
    );
  }
}

export default connect(mapStateToProps, actionCreators)(Task);
