import { createAction } from 'redux-actions';

export const addTask = createAction('TASK_ADD');
export const removeTask = createAction('TASK_REMOVE');
export const moveTask = createAction('TASK_MOVE');
