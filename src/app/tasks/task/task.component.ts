import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Todo } from './task.model';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css'],
  standalone: true,
})
export class TaskComponent {
  @Input() colType!: string;
  @Input() task!: Todo;
  @Output() delete = new EventEmitter<string>();
  @Output() move = new EventEmitter<Todo>();

  get RowClass() {
    return this.colType === 'Completed' ? 'table-success' : 'table-warning';
  }

  onDeleteTask() {
    this.delete.emit(this.task.id);
  }

  onMoveTask() {
    this.move.emit(this.task);
  }
}
