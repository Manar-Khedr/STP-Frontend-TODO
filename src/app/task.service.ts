// src/app/task.service.ts
import { Injectable, inject } from '@angular/core';
import { Firestore, collectionData, collection, doc, setDoc, deleteDoc, updateDoc } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { Todo } from './tasks/task/task.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasksSubject = new BehaviorSubject<Todo[]>([]);
  tasks$ = this.tasksSubject.asObservable();

  firebaseUrl = 'https://firestore.googleapis.com/v1/projects/stp-todo/databases/(default)/documents/todoUserTasks';
  private httpClient = inject(HttpClient);

  constructor(private firestore: Firestore) {
    this.loadTasks();
  }

  private loadTasks() {
    const tasksCollection = collection(this.firestore, 'todoUserTasks');
    collectionData(tasksCollection, { idField: 'id' }).subscribe((tasks: Todo[]) => {
      this.tasksSubject.next(tasks);
    });
  }

  getTasks(): Observable<Todo[]> {
    return this.tasks$;
  }

  addTask(task: Todo) {
    const tasksCollection = collection(this.firestore, 'todoUserTasks');
    setDoc(doc(tasksCollection), task);
  }

  deleteTask(id: string) {
    const taskDoc = doc(this.firestore, `todoUserTasks/${id}`);
    deleteDoc(taskDoc);
  }

  moveTask(updatedTask: Todo) {
    const taskDoc = doc(this.firestore, `todoUserTasks/${updatedTask.id}`);
    updateDoc(taskDoc, { ...updatedTask });
  }
}
