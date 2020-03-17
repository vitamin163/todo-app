import React from 'react';
import { connect } from 'react-redux';
import { DragDropContext } from 'react-beautiful-dnd';
import { Button, Spinner } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import * as actions from '../../store/actions';
import NewTaskForm from '../NewTaskForm/NewTaskForm';
import Column from '../Column/Column';
import classes from './Tasks.module.css';
import { getDestination } from '../../utils';
import ErrorAlert from '../ErrorAlert/ErrorAlert';

const mapStateToProps = state => {
  const props = {
    tasks: state.users.tasks,
    columns: state.users.columns,
    columnOrder: state.columnOrder,
    userId: state.auth.userId,
    ui: state.ui,
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
      userId,
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
      const { newStartColumn, newFinishColumn } = getDestination(
        draggableId,
        source.droppableId,
        destination.droppableId,
        columns,
        destination.index
      );
      moveTaskOtherColumn({ newStartColumn, newFinishColumn });
      fetchUpdateMoveTaskOtherColumn({
        startColumn,
        finishColumn,
        newStartColumn,
        newFinishColumn,
        userId,
      });
      return;
    }

    const column = columns[source.droppableId];
    const newTaskIds = [...column.taskIds];
    newTaskIds.splice(source.index, 1);
    newTaskIds.splice(destination.index, 0, draggableId);

    const newColumn = { ...column, taskIds: newTaskIds };
    moveTask({ column: newColumn });
    fetchUpdateMoveTask({ column, newColumn, userId });
  };

  render() {
    const { tasks, columns, columnOrder, ui } = this.props;
    if (ui.fetchTasksState === 'request') {
      return <Spinner animation="grow" variant="dark" />;
    }

    if (ui.fetchTasksState === 'success') {
      return (
        <>
          <div className={classes.TasksContainer}>
            <div className={classes.ControlPanel}>
              <NewTaskForm />
              <NavLink to="/taskList">
                <Button variant="info">Show list</Button>
              </NavLink>
            </div>
            <div className={classes.Tasks}>
              <DragDropContext onDragEnd={this.onDragEnd}>
                {columnOrder.map(columnId => {
                  const column = columns[columnId];
                  const columnTasks = column.taskIds.map(
                    taskId => tasks[taskId]
                  );
                  return (
                    <Column
                      key={column.id}
                      column={column}
                      tasks={columnTasks}
                    />
                  );
                })}
              </DragDropContext>
            </div>
            <div className={classes.Error}>
              {ui.removeState === 'failure' && (
                <ErrorAlert processName="removeState">{`Fail remove. ${ui.removeError}`}</ErrorAlert>
              )}
              {ui.moveTaskState === 'failure' && (
                <ErrorAlert processName="moveTaskState">{`Fail move. ${ui.moveTaskError}`}</ErrorAlert>
              )}
              {ui.moveTaskOtherColumnState === 'failure' && (
                <ErrorAlert processName="moveTaskOtherColumnState">{`Fail move. ${ui.moveTaskOtherColumnError}`}</ErrorAlert>
              )}
            </div>
          </div>
          <div className={classes.Footer}>
            <NavLink to="/logout">
              <Button variant="info">Logout</Button>
            </NavLink>
          </div>
        </>
      );
    }
    return (
      ui.fetchTasksState === 'failure' && (
        <div className={classes.Error}>
          <ErrorAlert processName="fetchTasksState">{`Fail load tasks. Try refresh page. ${ui.fetchTasksError}`}</ErrorAlert>
        </div>
      )
    );
  }
}

export default connect(mapStateToProps, actionCreators)(Tasks);
