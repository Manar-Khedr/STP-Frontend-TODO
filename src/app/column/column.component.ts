import { Component, Input, OnChanges, OnInit, SimpleChanges, inject } from '@angular/core';
import { Todo } from '../tasks/task/task.model';
import { TasksComponent } from '../tasks/tasks.component';
import { TaskComponent } from '../tasks/task/task.component';
import { CommonModule } from '@angular/common';
import { ColumnTypes } from './col-types';
import { TaskService } from '../task.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.css'],
  standalone: true,
  imports: [TasksComponent, TaskComponent,CommonModule]
})
export class ColumnComponent implements OnInit {
  colTypes = ColumnTypes;
  tasks: Todo[] = [];
  private authService = inject(AuthService);
  userEmail = this.authService.userEmail;


  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.taskService.tasks$.subscribe(tasks => this.tasks = tasks);
  }
}
