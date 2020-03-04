import { combineReducers } from 'redux';
import _ from 'lodash';
import { handleActions } from 'redux-actions';
import { reducer as formReducer } from 'redux-form';
import * as actions from '../actions';

const tasks = handleActions(
  {
    [actions.addTask](state, { payload: { task } }) {
      return { ...state, [task.id]: task };
    },
    [actions.removeTask](state, { payload: { id } }) {
      return { ..._.omit(state, id) };
    },
  },
  {}
);

const columns = handleActions(
  {
    [actions.addTask](state, { payload: { task } }) {
      const { column1 } = state;
      const { taskIds } = column1;
      const updateTaskIds = [task.id, ...taskIds];
      const updateColumn1 = { ...column1, taskIds: updateTaskIds };
      return { ...state, column1: updateColumn1 };
    },
    [actions.removeTask](state, { payload: { id } }) {
      const { column1 } = state;
      const { taskIds } = column1;
      const updateTaskIds = _.without(taskIds, id);
      const updateColumn1 = { ...column1, taskIds: updateTaskIds };
      return { ...state, column1: updateColumn1 };
    },
    [actions.moveTask](state, { payload: { result } }) {
      const { draggableId, source, destination } = result;
      const column = state[source.droppableId];
      const newTaskIds = [...column.taskIds];
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);
      const newColumn = { ...column, taskIds: newTaskIds };
      return { ...state, [source.droppableId]: newColumn };
    },
    [actions.moveTaskOtherColumn](state, { payload: { result } }) {
      const { draggableId, source, destination } = result;
      const startColumn = state[source.droppableId];
      const finishColumn = state[destination.droppableId];
      const startTaskIds = [...startColumn.taskIds];
      startTaskIds.splice(source.index, 1);
      const newStartColumn = { ...startColumn, taskIds: startTaskIds };
      const finishTaskIds = [...finishColumn.taskIds];
      finishTaskIds.splice(destination.index, 0, draggableId);
      const newFinishColumn = { ...finishColumn, taskIds: finishTaskIds };
      return {
        ...state,
        [newStartColumn.id]: newStartColumn,
        [newFinishColumn.id]: newFinishColumn,
      };
    },
  },
  {
    column1: {
      id: 'column1',
      title: 'To Do',
      taskIds: [],
    },
    column2: {
      id: 'column2',
      title: 'In progress',
      taskIds: [],
    },
    column3: {
      id: 'column3',
      title: 'Done',
      taskIds: [],
    },
  }
);
const columnOrder = handleActions({}, ['column1', 'column2', 'column3']);
export default combineReducers({
  tasks,
  columns,
  columnOrder,
  form: formReducer,
});
