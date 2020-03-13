import { combineReducers } from 'redux';
import _ from 'lodash';
import { handleActions } from 'redux-actions';
import { reducer as formReducer } from 'redux-form';
import * as actions from '../actions';
import { newUser } from '../../templates/templates';

const auth = handleActions(
  {
    [actions.authSuccess](state, { payload: { token, email, userId } }) {
      return { ...state, token, email, userId };
    },
    [actions.logout](state) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('expirationDate');
      return { ...state, token: null, email: null, userId: null };
    },
  },
  { token: null, email: null, userId: null }
);
const users = handleActions(
  {
    [actions.registrationSuccess](state, { payload: { email } }) {
      return { ...state, [email]: newUser(email) };
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
      // const { taskList } = state;
      // const updateTaskList = [...taskList, task.id];
      return {
        ...state,
        tasks: updateTasks,
        columns: updateColumns,
        // taskList: updateTaskList,
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
    [actions.sortTaskList](state, { payload: status }) {
      return { ...state, status };
    },
  },
  { status: 'all' }
);
const columnOrder = handleActions({}, ['column1', 'column2', 'column3']);
export default combineReducers({
  users,
  columnOrder,
  form: formReducer,
  auth,
});
