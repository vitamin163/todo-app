import React from 'react';
import { connect } from 'react-redux';
// import _ from 'lodash';
import { Draggable } from 'react-beautiful-dnd';
import { Button } from 'react-bootstrap';
import * as actions from '../../store/actions';
import classes from './Task.module.css';

const mapStateToProps = state => {
  const props = {
    userId: state.auth.userId,
    columns: state.users.columns,
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
            <Button
              variant="secondary"
              onClick={this.handleRemove(task.id, column)}
              type="button"
            >
              &times;
            </Button>
          </div>
        )}
      </Draggable>
    );
  }
}

export default connect(mapStateToProps, actionCreators)(Task);
