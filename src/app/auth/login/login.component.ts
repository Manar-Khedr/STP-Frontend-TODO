import { Component, DestroyRef, OnInit,inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, of } from 'rxjs';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
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
