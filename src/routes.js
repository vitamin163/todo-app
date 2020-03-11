const host = 'https://todolist-a8a2d.firebaseio.com';

export default {
  usersPath: () => [host, 'users.json'].join('/'),
  userPath: userId => [host, 'users', `${userId}.json`].join('/'),
  tasksPath: userId => [host, 'users', `${userId}`, 'tasks.json'].join('/'),
  columnsPath: userId => [host, 'users', `${userId}`, 'columns.json'].join('/'),
  columnPath: (userId, columnId) =>
    [host, 'users', `${userId}`, 'columns', `${columnId}.json`].join('/'),
  columnOrderPath: () => [host, 'columnOrder.json'].join('/'),
};
