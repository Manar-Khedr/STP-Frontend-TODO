import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TaskService } from './task.service';
import { Todo } from './tasks/task/task.model';
import { ExperimentalPendingTasks } from '@angular/core';

describe('TaskService', () => {
  let service: TaskService; // removed the load tasks cz it sends an extra request to the http client 
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskService]
    });

    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);

    // Mock the loadTasks method to prevent it from making an HTTP request --> mock to i
    spyOn(service as any, 'loadTasks').and.callFake(() => {});
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no unmatched requests
  });

  it('should be created', () => {
    console.log("TESTING: should be created");
    expect(service).toBeTruthy();
  });

  it('should delete a task', () => {
    console.log("TESTING: should delete a task");
    const taskId = '1';
    
    service.deleteTask(taskId); // Call the method to delete a task

    // Expect the delete request to be made
    const req = httpMock.expectOne(`${service.firebaseUrl}/${taskId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({}); // Respond with an empty response

    // Optionally check if loadTasks was called (if needed)
    expect((service as any).loadTasks).toHaveBeenCalled();
  });

  it('should move a task', () => {
    console.log("TESTING: should move a task");
    const updatedTask: Todo = { id: '1', type: 'Completed', todoText: 'Updated Task', userEmail: 'updated@example.com' };

    service.moveTask(updatedTask); // Call the method to move a task

    // Expect the patch request to be made
    const req = httpMock.expectOne(`${service.firebaseUrl}/${updatedTask.id}`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body.fields.todoText.stringValue).toBe(updatedTask.todoText);
    req.flush({}); // Respond with an empty response

    // Optionally check if loadTasks was called (if needed)
    expect((service as any).loadTasks).toHaveBeenCalled();
  });

  it('should add a task', () => {
    console.log("TESTING: should add a task");
    const newTask: Todo = { id: '1', type: 'Pending', todoText: 'Added Task', userEmail: 'added@example.com' };

    service.addTask(newTask); // Call the method to add a task

    // Expect the POST request to be made
    const req = httpMock.expectOne(service.firebaseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.fields.todoText.stringValue).toBe(newTask.todoText);
    req.flush({}); // Respond with an empty response

    // Optionally check if loadTasks was called (if needed)
    expect((service as any).loadTasks).toHaveBeenCalled();
  });
});
