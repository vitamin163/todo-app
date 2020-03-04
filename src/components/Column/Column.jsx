import React from 'react';
import classes from './Column.module.css';
import Task from '../Task/Task';
import {Droppable} from 'react-beautiful-dnd';

export default class Column extends React.Component {
  constructor(props) {
    super(props);
    this.columnRef = React.createRef();
  }
  render() {
    const { column, tasks } = this.props;
    return (
      <div className={classes.ColumnContainer}>
        <h3 className={classes.ColumnTitle}>{column.title}</h3>
        <Droppable droppableId={column.id}>
          {(provided) => (
        <div
          className={classes.ColumnTaskList}
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          {tasks.map((task, index) => <Task key={task.id} task={task} index={index} />)}
          {provided.placeholder}
        </div>
          )}
        </Droppable>
      </div>
    );
  }
}
