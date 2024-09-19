import {ChangeDetectionStrategy, Component, DestroyRef, inject, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {merge} from 'rxjs';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';

/** @title Form field with error messages */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css',], // <-- Should be styleUrls (plural)
  standalone: true,
  imports: [MatDividerModule, MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatIconModule, RouterLink, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class LoginComponent {

  private destroyRef = inject(DestroyRef);
  private auth = inject(AuthService);



  form = new FormGroup(
    {
      email: new FormControl('', {
        validators: [ Validators.email, Validators.required],
        //asyncValidators: [emailIsUnique],
      }), // initial
      password: new FormControl('',{
        validators: [Validators.required, Validators.minLength(6)]
      }) // initial value
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
    const enteredEmail = this.form.get('email')?.value!;
    const enteredPassword = this.form.get('password')?.value!;
    console.log("entered email: "+ enteredEmail);
    console.log("entered password: "+ enteredPassword);

    if(this.form.valid){
      // enter cred to firebase
      this.auth.login(enteredEmail, enteredPassword).subscribe({
        next: (userId) => {
          // add user to the users in auth
          console.log("successful login with uid: "+ userId);

          this.auth.checkLoginUser(userId).subscribe({
            next: (userData) => {
              if(userData){
                console.log("Found data in the database");
              } else{
                console.log("User Not Found in the database.");
              }
              
            }
          });
        },
        error: (error) => {
          console.log(error);
        }
      });
    }
  }


}
