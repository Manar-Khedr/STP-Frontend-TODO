import {ChangeDetectionStrategy, Component, DestroyRef, inject, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {merge} from 'rxjs';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

/** @title Form field with error messages */
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
  standalone: true,
  imports: [MatDividerModule, MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatIconModule, CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupComponent {

  private destroyRef = inject(DestroyRef);
  private auth = inject(AuthService);


  form = new FormGroup(
    {
      email: new FormControl('', {
        validators: [ Validators.email, Validators.required],
      }), // initial
      password: new FormControl('',{
        validators: [Validators.required, Validators.minLength(6)]
      }), // initial value
      name: new FormControl('', {
        validators: [Validators.required]})
    }
  );

  errorMessage = signal('');

  constructor() {
    merge(this.form.controls.email.statusChanges, this.form.controls.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }

  updateErrorMessage() {
    if (this.form.controls.email.hasError('required')) {
      this.errorMessage.set('You must enter a value');
    } else if (this.form.controls.email.hasError('email')) {
      this.errorMessage.set('Not a valid email');
    } else {
      this.errorMessage.set('');
    }
  }

  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
  get emailIsInvalid(){
    return this.form.controls.email.touched && this.form.controls.email.dirty && this.form.controls.email.invalid;
  }

  get passwordIsInvalid(){
    return this.form.controls.password.touched && this.form.controls.password.dirty && this.form.controls.password.invalid;
  }

  onSubmit(){
    const enteredName = this.form.get('name')?.value!;
    const enteredEmail = this.form.get('email')?.value!;
    const enteredPassword = this.form.get('password')?.value!;
    console.log("entered email: "+ enteredEmail);
    console.log("entered password: "+ enteredPassword);

    if(this.form.valid){
      // enter cred to firebase
      this.auth.signup(enteredEmail, enteredName ,enteredPassword).subscribe({
        next: (userId) => {
          // add user to the users in auth
          console.log("successful signup with uid: "+ userId);
        },
        error: (error) => {
          console.log(error);
        }
      });
    }
  }
  

}
