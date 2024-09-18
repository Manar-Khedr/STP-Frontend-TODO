import { Component,DestroyRef,inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
  imports: [ReactiveFormsModule]
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
