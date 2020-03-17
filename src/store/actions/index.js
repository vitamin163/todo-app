import { createAction } from 'redux-actions';
import _ from 'lodash';
import axios from 'axios';
import { dbNewUser } from '../../templates/templates';
import routes from '../../routes';

export const addTaskSuccess = createAction('TASK_ADD_SUCCESS');
export const addTaskFailure = createAction('TASK_ADD_FAILURE');
export const moveTask = createAction('MOVE_TASK');
export const moveTaskRequest = createAction('MOVE_TASK_REQUEST');
export const moveTaskSuccess = createAction('MOVE_TASK_SUCCESS');
export const moveTaskFailure = createAction('MOVE_TASK_FAILURE');
export const moveTaskOtherColumn = createAction('MOVE_TASK_OTHER_COLUMN');
export const moveTaskOtherColumnRequest = createAction(
  'MOVE_TASK_OTHER_COLUMN_REQUEST'
);
export const moveTaskOtherColumnSuccess = createAction(
  'MOVE_TASK_OTHER_COLUMN_SUCCESS'
);
export const moveTaskOtherColumnFailure = createAction(
  'MOVE_TASK_OTHER_COLUMN_FAILURE'
);
export const removeTaskRequest = createAction('REMOVE_TASK_REQUEST');
export const removeTaskSuccess = createAction('REMOVE_TASK_SUCCESS');
export const removeTaskFailure = createAction('REMOVE_TASK_FAILURE');
export const fetchTasksRequest = createAction('TASKS_FETCH_REQUEST');
export const fetchTasksSuccess = createAction('TASKS_FETCH_SUCCESS');
export const fetchTasksFailure = createAction('TASKS_FETCH_FAILURE');
export const authSuccess = createAction('AUTH_SUCCESS');
export const authFailure = createAction('AUTH_FAILURE');
export const logout = createAction('LOGOUT');
export const registrationSuccess = createAction('REGISTRATION_SUCCESS');
export const registrationFailure = createAction('REGISTRATION_FAILURE');
export const sortTaskList = createAction('SORT_TASK_LIST');
export const closeErrorAlert = createAction('CLOSE_ERROR_ALERT');

export const fetchUpdateMoveTask = ({
  column,
  newColumn,
  userId,
}) => async dispatch => {
  dispatch(moveTaskRequest());
  try {
    await axios.patch(routes.columnPath(userId, newColumn.id), {
      ...newColumn,
    });
  } catch (error) {
    dispatch(moveTaskFailure({ column, error: error.message }));
    throw error;
  }
};

export const fetchUpdateMoveTaskOtherColumn = ({
  startColumn,
  finishColumn,
  newStartColumn,
  newFinishColumn,
  userId,
}) => async dispatch => {
  dispatch(moveTaskOtherColumnRequest());
  try {
    const response1 = await axios.patch(
      routes.columnPath(userId, newStartColumn.id),
      {
        ...newStartColumn,
      }
    );

    const response2 = await axios.patch(
      routes.columnPath(userId, newFinishColumn.id),
      {
        ...newFinishColumn,
      }
    );
    await Promise.all([response1, response2]);
  } catch (error) {
    await dispatch(
      moveTaskOtherColumnFailure({
        startColumn,
        finishColumn,
        error: error.message,
      })
    );
    throw error;
  }
};

export const addTask = ({ task, column1, userId }) => async dispatch => {
  const responseTask = await axios.post(routes.tasksPath(userId), {
    ...task,
  });

  const { name: id } = responseTask.data;
  const newTaskIds = [id, ...column1.taskIds];
  const newColumn1 = { ...column1, taskIds: newTaskIds };
  await axios.patch(routes.columnPath(userId, column1.id), {
    ...newColumn1,
  });
  const updateTask = { ...task, id };
  dispatch(addTaskSuccess({ task: updateTask }));
};

export const removeTask = ({ taskId, column, userId }) => async dispatch => {
  dispatch(removeTaskRequest());
  try {
    const { taskIds } = column;
    const updateTaskIds = _.without(taskIds, taskId);
    const updateColumn = { ...column, taskIds: updateTaskIds };

    const response1 = axios.patch(routes.columnPath(userId, column.id), {
      ...updateColumn,
    });
    const response2 = await axios.delete(routes.taskPath(userId, taskId));
    const [{ data: responseColumn }] = await Promise.all([
      response1,
      response2,
    ]);
    dispatch(removeTaskSuccess({ id: taskId, column: responseColumn }));
  } catch (e) {
    dispatch(removeTaskFailure(e.message));
    throw e;
  }
};

export const fetchTasks = userId => async dispatch => {
  dispatch(fetchTasksRequest());
  try {
    const response = await axios.get(routes.userPath(userId));
    const { tasks, columns } = response.data;
    dispatch(fetchTasksSuccess({ tasks, columns }));
  } catch (e) {
    dispatch(fetchTasksFailure(e.message));
    throw e;
  }
};

const autoLogout = time => dispatch => {
  setTimeout(() => {
    dispatch(logout());
  }, time * 1000);
};

export const auth = (email, password, process) => async dispatch => {
  const authData = {
    email,
    password,
    returnSecureToken: true,
  };
  const url = {
    login:
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCHD5DNd6NJgYeMIvMjeeQOJaJgmTdXzgM',
    registration:
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCHD5DNd6NJgYeMIvMjeeQOJaJgmTdXzgM',
  };

  const response = await axios.post(url[process], authData);

  const { email: responseEmail, localId, idToken, expiresIn } = response.data;

  if (process === 'registration') {
    await axios.patch(routes.userPath(localId), dbNewUser(responseEmail));
    dispatch(registrationSuccess({ email: responseEmail }));
  }

  const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
  localStorage.setItem('token', idToken);
  localStorage.setItem('userId', localId);
  localStorage.setItem('email', email);
  localStorage.setItem('expirationDate', expirationDate);
  dispatch(authSuccess({ token: idToken, email, userId: localId }));
  dispatch(autoLogout(expiresIn));
};

export const autoLogin = () => {
  return dispatch => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const email = localStorage.getItem('email');
    if (!token) {
      dispatch(logout());
    } else {
      const expirationDate = new Date(localStorage.getItem('expirationDate'));
      if (expirationDate <= new Date()) {
        dispatch(logout());
      } else {
        dispatch(authSuccess({ token, email, userId }));
        dispatch(
          autoLogout((expirationDate.getTime() - new Date().getTime()) / 1000)
        );
      }
    }
  };
};
