import { combineReducers } from 'redux';
import _ from 'lodash';
import { handleActions } from 'redux-actions';
import { reducer as formReducer } from 'redux-form';
import * as actions from '../actions';

const tasks = handleActions(
  {
    [actions.fetchTasksSuccess](state, { payload: { userTasks } }) {
      const updatedTasks = userTasks.reduce((acc, task) => {
        return { ...acc, [task.id]: task };
      }, {});
      return { ...updatedTasks };
    },
    [actions.addTaskSuccess](state, { payload: { task } }) {
      return { ...state, [task.id]: task };
    },
    [actions.removeTaskSuccess](state, { payload: { id } }) {
      return { ..._.omit(state, id) };
    },
  },
  {}
);

const columns = handleActions(
  {
    [actions.fetchTasksSuccess](state, { payload: { userTasks, allColumns } }) {
      const allUserTaskIds = userTasks.reduce((acc, task) => {
        return [...acc, task.id];
      }, []);

      const updatedColumns = allColumns.reduce((acc, column) => {
        const updatedTaskIds = column.taskIds.filter(id =>
          allUserTaskIds.includes(id)
        );
        const updatedColumn = { ...column, taskIds: updatedTaskIds };
        return { ...acc, [column.id]: updatedColumn };
      }, {});
      return { ...updatedColumns };
    },
    [actions.addTaskSuccess](state, { payload: { task } }) {
      const { column1 } = state;
      const { taskIds } = column1;
      const updateTaskIds = [task.id, ...taskIds];
      const updateColumn1 = { ...column1, taskIds: updateTaskIds };
      return { ...state, column1: updateColumn1 };
    },
    [actions.removeTaskSuccess](state, { payload: { updateColumn } }) {
      return { ...state, [updateColumn.id]: updateColumn };
    },
    [actions.moveTask](state, { payload: { column } }) {
      return { ...state, [column.id]: column };
    },
    [actions.moveTaskFailure](state, { payload: { column } }) {
      return { ...state, [column.id]: column };
    },
    [actions.moveTaskOtherColumn](
      state,
      { payload: { newStartColumn, newFinishColumn } }
    ) {
      return {
        ...state,
        [newStartColumn.id]: newStartColumn,
        [newFinishColumn.id]: newFinishColumn,
      };
    },
    [actions.moveTaskOtherColumnFailure](
      state,
      { payload: { startColumn, finishColumn } }
    ) {
      return {
        ...state,
        [startColumn.id]: startColumn,
        [finishColumn.id]: finishColumn,
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
const taskRemovingState = handleActions(
  {
    [actions.removeTaskRequest]() {
      return 'requested';
    },
    [actions.removeTaskFailure]() {
      return 'failed';
    },
    [actions.removeTaskSuccess]() {
      return 'finished';
    },
  },
  'none'
);
const columnOrder = handleActions({}, ['column1', 'column2', 'column3']);

const auth = handleActions(
  {
    [actions.loginSuccess](state, { payload: { token, email } }) {
      return { ...state, token, user: email };
    },
    [actions.logout](state) {
      console.log('logout');
      localStorage.removeItem('token');
      localStorage.removeItem('expirationDate');
      return { ...state, token: null, user: null };
    },
  },
  { token: null, user: null }
);
export default combineReducers({
  tasks,
  columns,
  columnOrder,
  taskRemovingState,
  form: formReducer,
  auth,
});