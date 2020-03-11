import React from 'react';
import { connect } from 'react-redux';
import { DragDropContext } from 'react-beautiful-dnd';
import { Button, Spinner } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import * as actions from '../../store/actions';
import NewTaskForm from '../NewTaskForm/NewTaskForm';
import Column from '../Column/Column';
import classes from './Tasks.module.css';

const mapStateToProps = state => {
  const props = {
    tasks: state.users.tasks,
    columns: state.users.columns,
    columnOrder: state.columnOrder,
    userId: state.auth.userId,
  };
  return props;
};

const actionCreators = {
  moveTask: actions.moveTask,
  moveTaskOtherColumn: actions.moveTaskOtherColumn,
  fetchUpdateMoveTask: actions.fetchUpdateMoveTask,
  fetchUpdateMoveTaskOtherColumn: actions.fetchUpdateMoveTaskOtherColumn,
  fetchTasks: actions.fetchTasks,
};

class Tasks extends React.Component {
  componentDidMount() {
    const { fetchTasks, userId } = this.props;
    fetchTasks(userId);
  }

  onDragEnd = result => {
    const {
      columns,
      moveTaskOtherColumn,
      fetchUpdateMoveTask,
      moveTask,
      fetchUpdateMoveTaskOtherColumn,
    } = this.props;
    const { draggableId, source, destination } = result;
    if (!destination) {
      return;
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    if (destination.droppableId !== source.droppableId) {
      const startColumn = columns[source.droppableId];
      const finishColumn = columns[destination.droppableId];
      const startTaskIds = [...startColumn.taskIds];
      startTaskIds.splice(source.index, 1);
      const newStartColumn = { ...startColumn, taskIds: startTaskIds };
      const finishTaskIds = [...finishColumn.taskIds];
      finishTaskIds.splice(destination.index, 0, +draggableId);
      const newFinishColumn = { ...finishColumn, taskIds: finishTaskIds };
      moveTaskOtherColumn({ newStartColumn, newFinishColumn });
      fetchUpdateMoveTaskOtherColumn({
        startColumn,
        finishColumn,
        newStartColumn,
        newFinishColumn,
      });
      return;
    }
    const column = columns[source.droppableId];

    const newTaskIds = [...column.taskIds];
    newTaskIds.splice(source.index, 1);
    newTaskIds.splice(destination.index, 0, +draggableId);
    const newColumn = { ...column, taskIds: newTaskIds };
    moveTask({ column: newColumn });
    fetchUpdateMoveTask({ column, newColumn });
  };

  render() {
    const { tasks, columns, columnOrder } = this.props;
    if (!tasks) {
      return <Spinner animation="grow" variant="dark" />;
    }
    return (
      <>
        <NewTaskForm />
        <DragDropContext onDragEnd={this.onDragEnd}>
          <div className={classes.TasksContainer}>
            {columnOrder.map(columnId => {
              const column = columns[columnId];
              const columnTasks = column.taskIds.map(taskId => tasks[taskId]);
              return (
                <Column key={column.id} column={column} tasks={columnTasks} />
              );
            })}
          </div>
        </DragDropContext>
        <NavLink to="/logout">
          <Button variant="info">Logout</Button>
        </NavLink>
      </>
    );
  }
}

export default connect(mapStateToProps, actionCreators)(Tasks);
