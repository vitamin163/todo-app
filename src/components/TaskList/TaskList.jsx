import React from 'react';
import { connect } from 'react-redux';
import { Button, DropdownButton, Dropdown } from 'react-bootstrap';
// import { NavLink } from 'react-router-dom';
import * as actions from '../../store/actions';
import NewTaskForm from '../NewTaskForm/NewTaskForm';
import classes from './TaskList.module.css';
import getDestination from '../../utils';

const mapStateToProps = state => {
  const props = {
    tasks: state.users.tasks,
    columns: state.users.columns,
    columnOrder: state.columnOrder,
    userId: state.auth.userId,
    status: state.users.status,
  };
  return props;
};

const actionCreators = {
  moveTask: actions.moveTask,
  moveTaskOtherColumn: actions.moveTaskOtherColumn,
  fetchUpdateMoveTask: actions.fetchUpdateMoveTask,
  fetchUpdateMoveTaskOtherColumn: actions.fetchUpdateMoveTaskOtherColumn,
  fetchTasks: actions.fetchTasks,
  removeTask: actions.removeTask,
  sortTaskList: actions.sortTaskList,
};

class TaskList extends React.Component {
  handleRemove = (taskId, columnId) => async () => {
    const { columns, removeTask, userId } = this.props;
    const column = columns[columnId];
    await removeTask({ taskId, column, userId });
  };

  sortHandler = sortStatus => () => {
    const { sortTaskList } = this.props;
    sortTaskList(sortStatus);
  };

  moveTaskHandler = (taskId, startColumnId, finishColumnId) => () => {
    if (startColumnId === finishColumnId) {
      return;
    }
    const {
      columns,
      moveTaskOtherColumn,
      fetchUpdateMoveTaskOtherColumn,
      userId,
    } = this.props;
    const startColumn = columns[startColumnId];
    const finishColumn = columns[finishColumnId];
    const { newStartColumn, newFinishColumn } = getDestination(
      taskId,
      startColumnId,
      finishColumnId,
      columns
    );
    moveTaskOtherColumn({ newStartColumn, newFinishColumn });
    fetchUpdateMoveTaskOtherColumn({
      startColumn,
      finishColumn,
      newStartColumn,
      newFinishColumn,
      userId,
    });
  };

  renderTaskList = (allTasks, ids) => {
    return ids.map(({ id, titleSort, columnId }) => (
      <div key={id} className={classes.Task}>
        <div className={classes.Content}>{allTasks[id].content}</div>
        <div className={classes.ControlPanel}>
          <div className={classes.TitleSort}>{titleSort}</div>
          <DropdownButton size="sm" id="dropdown-item-button" title="Move task">
            <Dropdown.Item
              as="button"
              onClick={this.moveTaskHandler(id, columnId, 'column1')}
            >
              ToDO
            </Dropdown.Item>
            <Dropdown.Item
              as="button"
              onClick={this.moveTaskHandler(id, columnId, 'column2')}
            >
              In progress
            </Dropdown.Item>
            <Dropdown.Item
              as="button"
              onClick={this.moveTaskHandler(id, columnId, 'column3')}
            >
              Done
            </Dropdown.Item>
          </DropdownButton>
          <Button
            size="sm"
            variant="secondary"
            onClick={this.handleRemove(id, columnId)}
            type="button"
          >
            &times;
          </Button>
        </div>
      </div>
    ));
  };

  render() {
    const { tasks, columns, status } = this.props;
    const {
      column1: { taskIds: taskIds1 },
      column2: { taskIds: taskIds2 },
      column3: { taskIds: taskIds3 },
    } = columns;
    const todoTaskIds = taskIds1.map(id => ({
      id,
      titleSort: 'ToDo',
      columnId: 'column1',
    }));
    const inProgressTaskIds = taskIds2.map(id => ({
      id,
      titleSort: 'In  progress',
      columnId: 'column2',
    }));
    const doneTaskIds = taskIds3.map(id => ({
      id,
      titleSort: 'Done',
      columnId: 'column3',
    }));
    const allTaskIds = [...todoTaskIds, ...inProgressTaskIds, ...doneTaskIds];

    const routeSort = {
      all: allTaskIds,
      toDo: todoTaskIds,
      inProgress: inProgressTaskIds,
      done: doneTaskIds,
    };

    return (
      <>
        <NewTaskForm />
        <DropdownButton id="dropdown-item-button" title="Sort list">
          <Dropdown.Item as="button" onClick={this.sortHandler('all')}>
            All tasks
          </Dropdown.Item>
          <Dropdown.Item as="button" onClick={this.sortHandler('toDo')}>
            ToDO
          </Dropdown.Item>
          <Dropdown.Item as="button" onClick={this.sortHandler('inProgress')}>
            In progress
          </Dropdown.Item>
          <Dropdown.Item as="button" onClick={this.sortHandler('done')}>
            Done
          </Dropdown.Item>
        </DropdownButton>
        <div className={classes.TasksContainer}>
          {this.renderTaskList(tasks, routeSort[status])}
        </div>
      </>
    );
  }
}

export default connect(mapStateToProps, actionCreators)(TaskList);
