import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ColumnComponent } from './column/column.component';
import { ColumnTypes } from './column/col-type';
import { TasksComponent } from './tasks/tasks.component';
import { Todo } from './tasks/task/task.model';
import { TaskService } from './task.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,ColumnComponent,TasksComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  colTypes = ColumnTypes;
  tasks: Todo[] = [];

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.taskService.tasks$.subscribe(tasks => this.tasks = tasks);
  }
}