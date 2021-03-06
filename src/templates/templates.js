export const dbNewUser = (email, uid) => ({
  uid,
  email,
  tasks: false,
  columns: {
    column1: {
      id: 'column1',
      title: 'To Do',
      taskIds: false,
    },
    column2: {
      id: 'column2',
      title: 'In progress',
      taskIds: false,
    },
    column3: {
      id: 'column3',
      title: 'Done',
      taskIds: false,
    },
  },
});

export const newUser = email => ({
  email,
  tasks: {},
  columns: {
    column1: {
      id: 'column1',
      title: 'To Do',
      taskIds: [],
    },
    column2: {
      id: 'column2',
      title: 'In progress',
      taskIds: [],
    },
    column3: {
      id: 'column3',
      title: 'Done',
      taskIds: [],
    },
  },
  show: 'all',
});
