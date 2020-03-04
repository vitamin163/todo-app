import { createAction } from 'redux-actions';

export const addTask = createAction('ADD_TASK');
export const removeTask = createAction('REMOVE_TASK');
export const moveTask = createAction('MOVE_TASK');
export const moveTaskOtherColumn = createAction('MOVE_TASK_OTHER_COLUMN');
