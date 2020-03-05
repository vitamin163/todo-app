import { createAction } from 'redux-actions';
import axios from 'axios';

export const moveTask = createAction('MOVE_TASK');
export const moveTaskOtherColumn = createAction('MOVE_TASK_OTHER_COLUMN');

export const addTaskSuccess = createAction('TASK_ADD_SUCCESS');

export const addTask = ({ task }) => async dispatch => {
  const response = await axios.post('http://localhost:3001/tasks', { ...task });
  dispatch(addTaskSuccess({ task: response.data }));
};

export const removeTaskRequest = createAction('REMOVE_TASK_REQUEST');
export const removeTaskSuccess = createAction('REMOVE_TASK_SUCCESS');
export const removeTaskFailure = createAction('REMOVE_TASK_FAILURE');

export const removeTask = ({ id, columnId }) => async dispatch => {
  dispatch(removeTaskRequest());
  try {
    await axios.delete(`http://localhost:3001/tasks/${id}`);
    dispatch(removeTaskSuccess({ id, columnId }));
  } catch (e) {
    dispatch(removeTaskFailure());
    throw e;
  }
};
