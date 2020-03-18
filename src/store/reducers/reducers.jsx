import { combineReducers } from 'redux';
import _ from 'lodash';
import { handleActions } from 'redux-actions';
import { reducer as formReducer } from 'redux-form';
import * as actions from '../actions';
import { newUser } from '../../templates/templates';

const ui = handleActions(
  {
    [actions.removeTaskRequest](state) {
      return { ...state, removeState: 'request' };
    },
    [actions.removeTaskSuccess](state) {
      return { ...state, removeState: 'success' };
    },
    [actions.removeTaskFailure](state, { payload: error }) {
      return { ...state, removeState: 'failure', removeError: error };
    },
    [actions.moveTaskRequest](state) {
      return { ...state, moveTaskState: 'request' };
    },
    [actions.moveTaskFailure](state, { payload: { error } }) {
      return { ...state, moveTaskState: 'failure', moveTaskError: error };
    },
    [actions.moveTaskOtherColumnRequest](state) {
      return { ...state, moveTaskOtherColumnState: 'request' };
    },
    [actions.moveTaskOtherColumnFailure](state, { payload: { error } }) {
      return {
        ...state,
        moveTaskOtherColumnState: 'failure',
        moveTaskOtherColumnError: error,
      };
    },
    [actions.addTaskFailure](state) {
      return { ...state, addTaskState: 'failure' };
    },
    [actions.registrationFailure](state) {
      return { ...state, registrationState: 'failure' };
    },
    [actions.authFailure](state) {
      return { ...state, authState: 'failure' };
    },
    [actions.fetchTasksRequest](state) {
      return { ...state, fetchTasksState: 'request' };
    },
    [actions.fetchTasksSuccess](state) {
      return { ...state, fetchTasksState: 'success' };
    },
    [actions.fetchTasksFailure](state, { payload: error }) {
      return { ...state, fetchTasksState: 'failure', fetchTasksError: error };
    },
    [actions.closeErrorAlert](state, { payload: process }) {
      return { ...state, [process]: 'init' };
    },
  },
  {
    removeState: 'init',
    removeError: null,
    moveTaskState: 'init',
    moveTaskError: null,
    addTaskState: 'init',
    registrationState: 'init',
    authState: 'init',
    moveTaskOtherColumnError: null,
    moveTaskOtherColumnState: 'init',
    fetchTasksState: 'init',
    fetchTasksError: null,
  }
);

const auth = handleActions(
  {
    [actions.authSuccess](state, { payload: { token, email, userId } }) {
      return { ...state, token, email, userId };
    },
    [actions.logout](state) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('expirationDate');
      localStorage.removeItem('email');
      return { ...state, token: null, email: null, userId: null };
    },
  },
  { token: null, email: null, userId: null }
);
const users = handleActions(
  {
    [actions.registrationSuccess](state, { payload: { email } }) {
      return { ...state, ...newUser(email) };
    },
    [actions.fetchTasksSuccess](state, { payload: { tasks, columns } }) {
      const chekTasks = tasks || {};
      const extractTasks = Object.entries(chekTasks);
      const updateTasks = extractTasks.reduce((acc, taskById) => {
        const [id, task] = taskById;
        const newTask = { ...task, id };
        return { ...acc, [id]: newTask };
      }, {});
      const columnsValues = Object.values(columns);
      const updateColumns = columnsValues.reduce((acc, column) => {
        const { id, taskIds } = column;
        const updateTaskIds = taskIds || [];
        const updateColumn = { ...column, taskIds: updateTaskIds };
        return { ...acc, [id]: updateColumn };
      }, {});
      return { ...state, tasks: updateTasks, columns: updateColumns };
    },
    [actions.moveTask](state, { payload: { column } }) {
      const { columns } = state;
      const updateColumns = { ...columns, [column.id]: column };
      return { ...state, columns: updateColumns };
    },
    [actions.moveTaskFailure](state, { payload: { column } }) {
      const { columns } = state;
      const updateColumns = { ...columns, [column.id]: column };
      return { ...state, columns: updateColumns };
    },
    [actions.moveTaskOtherColumn](
      state,
      { payload: { newStartColumn, newFinishColumn } }
    ) {
      const { columns } = state;
      const updateColumns = {
        ...columns,
        [newStartColumn.id]: newStartColumn,
        [newFinishColumn.id]: newFinishColumn,
      };
      return { ...state, columns: updateColumns };
    },
    [actions.moveTaskOtherColumnFailure](
      state,
      { payload: { startColumn, finishColumn } }
    ) {
      const { columns } = state;
      const updateColumns = {
        ...columns,
        [startColumn.id]: startColumn,
        [finishColumn.id]: finishColumn,
      };
      return { ...state, columns: updateColumns };
    },
    [actions.addTaskSuccess](state, { payload: { task } }) {
      const { tasks } = state;
      const updateTasks = { ...tasks, [task.id]: task };
      const { column1 } = state.columns;
      const { taskIds } = column1;
      const updateTaskIds = [task.id, ...taskIds];
      const updateColumn1 = { ...column1, taskIds: updateTaskIds };
      const updateColumns = { ...state.columns, column1: updateColumn1 };
      return {
        ...state,
        tasks: updateTasks,
        columns: updateColumns,
      };
    },
    [actions.removeTaskSuccess](state, { payload: { id, column } }) {
      const { columns } = state;
      const { tasks } = state;
      const { taskIds } = column;
      const checkTaskIds = taskIds || [];
      const updateColumn = { ...column, taskIds: checkTaskIds };
      const updateColumns = { ...columns, [updateColumn.id]: updateColumn };
      const updateTasks = { ..._.omit(tasks, id) };
      return { ...state, tasks: updateTasks, columns: updateColumns };
    },
    [actions.sortTaskList](state, { payload: show }) {
      return { ...state, show };
    },
  },
  { show: 'all' }
);
const columnOrder = handleActions({}, ['column1', 'column2', 'column3']);
export default combineReducers({
  users,
  columnOrder,
  form: formReducer,
  auth,
  ui,
});
