// dummy-tasks.ts
export const mockTasksResponse = {
    documents: [
      {
        name: 'https://firestore.googleapis.com/v1/projects/stp-todo/databases/(default)/documents/todoUserTasks/task1',
        fields: {
          type: { stringValue: 'Completed' },
          todoText: { stringValue: 'Task 1' },
          userEmail: { stringValue: 'manar@example.com' }
        }
      },
      {
        name: 'https://firestore.googleapis.com/v1/projects/stp-todo/databases/(default)/documents/todoUserTasks/task2',
        fields: {
          type: { stringValue: 'Pending' },
          todoText: { stringValue: 'Task 2' },
          userEmail: { stringValue: 'manar@example.com' }
        }
      },
      {
        name: 'https://firestore.googleapis.com/v1/projects/stp-todo/databases/(default)/documents/todoUserTasks/task3',
        fields: {
          type: { stringValue: 'Completed' },
          todoText: { stringValue: 'Task 3' },
          userEmail: { stringValue: 'yara@example.com' }
        }
      }
    ]
  };
  