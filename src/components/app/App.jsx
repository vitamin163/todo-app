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
};

class App extends React.Component {
  onDragEnd = result => {
    const { moveTask, moveTaskOtherColumn } = this.props;
    const { source, destination } = result;
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
    moveTask({ result });
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
