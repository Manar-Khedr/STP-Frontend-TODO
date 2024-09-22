import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Todo } from './tasks/task/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasksSubject = new BehaviorSubject<Todo[]>([]);
  tasks$ = this.tasksSubject.asObservable();

  private firebaseUrl = 'https://firestore.googleapis.com/v1/projects/stp-todo/databases/(default)/documents/todoUserTasks';
  private httpClient = inject(HttpClient);

  constructor() {
    this.loadTasks();
  }

  private loadTasks() {
    console.log("fetching data using httpclient");
    this.httpClient.get<{ documents: any[] }>(this.firebaseUrl).subscribe(response => {
      const tasks = response.documents ? response.documents.map(doc => ({
        id: doc.name.split('/').pop(),
        type: doc.fields.type.stringValue,
        todoText: doc.fields.todoText.stringValue,
        userEmail: doc.fields.userEmail.stringValue
      })) : [];
      this.tasksSubject.next(tasks);
    });
  }

  getTasks(): Observable<Todo[]> {
    return this.tasks$;
  }

  addTask(task: Todo) {
    const body = {
      fields: {
        type: { stringValue: task.type },
        todoText: { stringValue: task.todoText },
        userEmail: { stringValue: task.userEmail }
      }
    };
    console.log(" adding task: "+body.fields.todoText.stringValue);
    this.httpClient.post(this.firebaseUrl, body).subscribe(() => {
      this.loadTasks();
    });
  }

  deleteTask(id: string) {
    const url = `${this.firebaseUrl}/${id}`;
    console.log("delete task task with id: "+id);
    this.httpClient.delete(url).subscribe(() => {
      this.loadTasks();
    });
  }

  moveTask(updatedTask: Todo) {
    const url = `${this.firebaseUrl}/${updatedTask.id}`;
    const body = {
      fields: {
        type: { stringValue: updatedTask.type },
        todoText: { stringValue: updatedTask.todoText },
        userEmail: { stringValue: updatedTask.userEmail }
      }
    };
    console.log("move task: "+body.fields.todoText.stringValue+" to type: "+body.fields.type.stringValue);
    this.httpClient.patch(url, body).subscribe(() => {
      this.loadTasks();
    });
  }
}
