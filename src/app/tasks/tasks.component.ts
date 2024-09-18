import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Todo } from './task/task.model';
import { TaskComponent } from './task/task.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
  standalone: true,
  imports: [TaskComponent, CommonModule, FormsModule]
})
export class TasksComponent implements OnChanges {
  @Input() colType!: string;
  @Output() taskMoved = new EventEmitter<Todo>();

  enteredTask = '';
  id = '';
  type = '';
  searchQuery = ''; // Add this property

  tasks: Todo[] = [];

  constructor(private taskService: TaskService) {
    this.taskService.tasks$.subscribe(tasks => this.tasks = tasks);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['colType']) {
      this.updateSelectedTasks(); // Ensure this reflects the current column type
    }
  }

  get selectedColumnTask() {
    return this.tasks
      .filter(task => task.type === this.colType)
      .filter(task => this.searchQuery ? task.todoText.toLowerCase().includes(this.searchQuery.toLowerCase()) : true); // Apply search filter
  }

  onDeleteTask(id: string) {
    this.taskService.deleteTask(id);
  }

  onMoveTask(task: Todo) {
    const updatedTask = { ...task, type: task.type === 'Completed' ? 'Pending' : 'Completed' };
    this.taskService.moveTask(updatedTask);
    this.taskMoved.emit(updatedTask);
  }

  onAddTask() {
    if (this.enteredTask !== '') {
      const newTask: Todo = {
        id: this.id === '' ? 't' + (this.tasks.length + 1) : this.id,
        type: this.type === '' ? this.colType : this.type,
        todoText: this.enteredTask,
        userEmail: 'manar@example.com'
      };
      this.taskService.addTask(newTask);
      this.enteredTask = ''; // Clear the input field
    }
  }

  private updateSelectedTasks() {
    // This method is now mainly used to ensure the current column type is handled correctly
  }

  trackByTaskId(index: number, task: Todo): string {
    return task.id;
  }

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value;
  }
  

  get InputId() {
    return this.colType + '-input-task';
  }

  get InputPlaceHolder() {
    return 'Add a ' + this.colType + ' task';
  }

  get InputButtonId() {
    return this.colType + '-add-btn';
  }

  get InputButtonClass() {
    return this.colType === 'Completed' ? 'btn btn-success' : 'btn btn-warning';
  }

  get SearchId() {
    return this.colType + '-search';
  }

  get SearchPlaceHolder() {
    return 'Search a ' + this.colType + ' task';
  }

  get todosId() {
    return this.colType + '-todos';
  }
}
