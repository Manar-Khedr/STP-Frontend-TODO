import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Todo } from '../tasks/task/task.model';
import { TasksComponent } from '../tasks/tasks.component';
import { TaskComponent } from '../tasks/task/task.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.css'],
  standalone: true,
  imports: [TasksComponent, TaskComponent,CommonModule]
})
export class ColumnComponent implements OnChanges {
  @Input() colType!: string;
  @Input() tasks: Todo[] = [];
  columnTasks: Todo[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['colType'] || changes['tasks']) {
      this.updateTasks();
    }
  }

  updateTasks(): void {
    this.columnTasks = this.tasks.filter(task => task.type === this.colType);
  }

  onDeleteTask(id: string) {
    this.tasks = this.tasks.filter(task => task.id !== id);
    this.updateTasks(); // Update tasks after deletion
  }

  onMoveTask(task: Todo) {
    // Emit the updated task to the parent component
    const updatedTask = { ...task, type: task.type === 'Completed' ? 'Pending' : 'Completed' };
    this.tasks = this.tasks.map(t => (t.id === task.id ? updatedTask : t));
    this.updateTasks(); // Update tasks after moving
  }

  trackByTaskId(index: number, task: Todo): string {
    return task.id;
  }
}
