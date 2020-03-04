import React from 'react';
import { connect } from 'react-redux';
import { Draggable } from 'react-beautiful-dnd';
import * as actions from '../../actions';
import classes from './Task.module.css';

const mapStateToProps = () => ({});

const actionCreators = { removeTask: actions.removeTask };

class Task extends React.Component {
  handleRemove = (taskId, columnId) => () => {
    console.log(columnId);
    const { removeTask } = this.props;
    removeTask({ id: taskId, columnId });
  };

  render() {
    const { task, index, columnId } = this.props;
    return (
      <Draggable draggableId={task.id} index={index}>
        {provided => (
          <div
            className={classes.Task}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            {task.content}
            <button
              onClick={this.handleRemove(task.id, columnId)}
              type="button"
            >
              &times;
            </button>
          </div>
        )}
      </Draggable>
    );
  }
}

export default connect(mapStateToProps, actionCreators)(Task);
