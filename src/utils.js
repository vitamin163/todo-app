import isEmail from 'validator/es/lib/isEmail';

export const getDestination = (
  taskId,
  startColumnId,
  finishColumnId,
  columns,
  finishTaskIndex = 0
) => {
  const startColumn = columns[startColumnId];
  const finishColumn = columns[finishColumnId];
  const startTaskIds = [...startColumn.taskIds];
  const startTaskIndex = startTaskIds.indexOf(taskId);
  startTaskIds.splice(startTaskIndex, 1);
  const newStartColumn = { ...startColumn, taskIds: startTaskIds };
  const finishTaskIds = [...finishColumn.taskIds];
  finishTaskIds.splice(finishTaskIndex, 0, taskId);
  const newFinishColumn = { ...finishColumn, taskIds: finishTaskIds };
  return { newStartColumn, newFinishColumn };
};

export const validateForm = (
  isValidInputs,
  email,
  password,
  confirm = 'empty'
) => {
  if (!email || !password || !confirm) {
    return false;
  }
  return isValidInputs;
};
/* eslint-disable consistent-return */
export const vaidateEmail = email => {
  if (!email) return;
  const isValid = isEmail(String(email));
  return !isValid;
};

export const validatePassword = password => {
  if (!password) return;
  const isValid = password.length < 6;
  return isValid;
};
/* eslint-enable */

export const parseErrors = (errorPart1, errorPart2) => {
  const errorMessage1 = errorPart1.errors.response
    ? errorPart1.errors.response.data.error.message.split('_').join(' ')
    : '';
  const errorMessage2 = errorPart2.message;
  return errorMessage1 ? ` ${errorMessage1}. ${errorMessage2}` : errorMessage2;
};
