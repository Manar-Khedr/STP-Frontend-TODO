import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ColumnComponent } from './column/column.component';
import { TasksComponent } from './tasks/tasks.component';
import { Todo } from './tasks/task/task.model';
import { TaskService } from './task.service';
import { LoginComponent } from "./auth/login/login.component";
import { ColumnTypes } from './column/col-types';
import { AuthComponent } from './auth/auth.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ColumnComponent, TasksComponent, LoginComponent, AuthComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Todo List Angular Project';
  colTypes = ColumnTypes;
  tasks: Todo[] = [];

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.taskService.tasks$.subscribe(tasks => this.tasks = tasks);
  }
}