import { createAction } from 'redux-actions';
import axios from 'axios';
import { dbNewUser } from '../../templates/templates';
import routes from '../../routes';

export const addTaskSuccess = createAction('TASK_ADD_SUCCESS');
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
export const authSuccess = createAction('AUTH_SUCCESS');
export const logout = createAction('LOGOUT');
export const registrationSuccess = createAction('REGISTRATION_SUCCESS');

export const fetchUpdateMoveTask = ({
  column,
  newColumn,
}) => async dispatch => {
  dispatch(moveTaskRequest());
  try {
    await axios.patch(`http://localhost:3001/columns/${newColumn.id}`, {
      ...newColumn,
    });
  } catch (e) {
    await dispatch(moveTaskFailure({ column }));
    console.log('сервер не отвечает! fetchUpdateMoveTask');
    throw e;
  }
};

export const fetchUpdateMoveTaskOtherColumn = ({
  startColumn,
  finishColumn,
  newStartColumn,
  newFinishColumn,
}) => async dispatch => {
  dispatch(moveTaskOtherColumnRequest());
  try {
    const promise1 = axios.patch(
      `http://localhost:3001/columns/${newStartColumn.id}`,
      {
        ...newStartColumn,
      }
    );
    const promise2 = axios.patch(
      `http://localhost:3001/columns/${newFinishColumn.id}`,
      {
        ...newFinishColumn,
      }
    );
    await Promise.all([promise1, promise2]);
  } catch (e) {
    await dispatch(moveTaskOtherColumnFailure({ startColumn, finishColumn }));
    console.log('сервер не отвечает! moveTaskOtherColumnFailure');
    throw e;
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

export const removeTask = ({ id, column }) => async dispatch => {
  dispatch(removeTaskRequest());
  try {
    const promise1 = axios.patch(`http://localhost:3001/columns/${column.id}`, {
      ...column,
    });
    const promise2 = axios.delete(`http://localhost:3001/tasks/${id}`);
    const [{ data: updateColumn }] = await Promise.all([promise1, promise2]);
    dispatch(removeTaskSuccess({ id, updateColumn }));
  } catch (e) {
    dispatch(removeTaskFailure());
    throw e;
  }
};

export const fetchTasks = userId => async dispatch => {
  // dispatch(fetchTasksRequest());
  try {
    const response = await axios.get(routes.userPath(userId));

    const { tasks, columns } = response.data;

    dispatch(fetchTasksSuccess({ tasks, columns }));
  } catch (e) {
    // dispatch(fetchTasksFailure());
    console.log(e); // убрать
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
    const regResponse = await axios.patch(
      routes.userPath(localId),
      dbNewUser(responseEmail)
    );
    console.log(regResponse.data);
    dispatch(registrationSuccess({ email: responseEmail }));
  }

  const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
  localStorage.setItem('token', idToken);
  localStorage.setItem('userId', localId);
  localStorage.setItem('expirationDate', expirationDate);
  dispatch(authSuccess({ token: idToken, email, userId: localId }));
  dispatch(autoLogout(expiresIn));
};
