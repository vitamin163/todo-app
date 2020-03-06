import { createAction } from 'redux-actions';
import axios from 'axios';

export const moveTask = createAction('MOVE_TASK');
export const moveTaskRequest = createAction('MOVE_TASK_REQUEST');
export const moveTaskSuccess = createAction('MOVE_TASK_SUCCESS');
export const moveTaskFailure = createAction('MOVE_TASK_FAILURE');
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

export const addTaskSuccess = createAction('TASK_ADD_SUCCESS');
export const addTask = ({ task, column1 }) => async dispatch => {
  const responseTask = await axios.post('http://localhost:3001/tasks', {
    ...task,
  });
  const { id } = responseTask.data;
  const newTaskIds = [id, ...column1.taskIds];
  const newColumn1 = { ...column1, taskIds: newTaskIds };

  await axios.patch('http://localhost:3001/columns/column1', {
    ...newColumn1,
  });
  dispatch(addTaskSuccess({ task: responseTask.data }));
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
