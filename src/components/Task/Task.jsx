import React from 'react';
import classes from './Task.module.css'
import { Draggable } from 'react-beautiful-dnd';

export default class Task extends React.Component {
  render() {
    const { task, index } = this.props;
    return (
      <Draggable draggableId={task.id} index={index}>
        {(provided) => (
          <div
            className={classes.Task}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            {task.content}
          </div>
        )}
      </Draggable>
    );
  }
}



