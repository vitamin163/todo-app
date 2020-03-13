export default (
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
