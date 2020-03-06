import React from 'react';
import { connect } from 'react-redux';
import { DragDropContext } from 'react-beautiful-dnd';
import * as actions from '../../actions';
import NewTaskForm from '../NewTaskForm/NewTaskForm';
import Column from '../Column/Column';
import classes from './App.module.css';

const mapStateToProps = state => {
  const props = {
    tasks: state.tasks,
    columns: state.columns,
    columnOrder: state.columnOrder,
  };
  return props;
};

const actionCreators = {
  moveTask: actions.moveTask,
  moveTaskOtherColumn: actions.moveTaskOtherColumn,
  fetchUpdateMoveTask: actions.fetchUpdateMoveTask,
};

class App extends React.Component {
  onDragEnd = async result => {
    const {
      columns,
      moveTaskOtherColumn,
      fetchUpdateMoveTask,
      moveTask,
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
      moveTaskOtherColumn({ result });
      return;
    }
    const column = columns[source.droppableId];

    const newTaskIds = [...column.taskIds];
    newTaskIds.splice(source.index, 1);
    newTaskIds.splice(destination.index, 0, +draggableId);
    const newColumn = { ...column, taskIds: newTaskIds };
    moveTask({ column: newColumn });
    await fetchUpdateMoveTask({ column, newColumn });
  };

  render() {
    const { tasks, columns, columnOrder } = this.props;
    return (
      <>
        <NewTaskForm />
        <DragDropContext onDragEnd={this.onDragEnd}>
          <div className={classes.AppContainer}>
            {columnOrder.map(columnId => {
              const column = columns[columnId];
              const columnTasks = column.taskIds.map(taskId => tasks[taskId]);
              return (
                <Column key={column.id} column={column} tasks={columnTasks} />
              );
            })}
          </div>
        </DragDropContext>
      </>
    );
  }
}

export default connect(mapStateToProps, actionCreators)(App);
