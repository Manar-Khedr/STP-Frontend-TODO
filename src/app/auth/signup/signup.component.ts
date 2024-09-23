import {ChangeDetectionStrategy, Component, DestroyRef, inject, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {merge} from 'rxjs';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatStepperModule } from '@angular/material/stepper';

/** @title Form field with error messages */
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
  standalone: true,
  imports: [ MatStepperModule ,MatDividerModule, MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatIconModule, CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupComponent {

  private destroyRef = inject(DestroyRef);
  private auth = inject(AuthService);


  // form = new FormGroup(
  //   {
  //     email: new FormControl('', {
  //       validators: [ Validators.email, Validators.required],
  //     }), // initial
  //     password: new FormControl('',{
  //       validators: [Validators.required, Validators.minLength(6)]
  //     }), // initial value
  //     name: new FormControl('', {
  //       validators: [Validators.required]})
  //   }
  // );

  form: FormGroup;

  errorMessage = signal('');

  // constructor() {
  //   merge(this.form.controls.email.statusChanges, this.form.controls.email.valueChanges)
  //     .pipe(takeUntilDestroyed())
  //     .subscribe(() => this.updateErrorMessage());
  // }

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]], 
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }  

  updateErrorMessage(): void {
    const emailControl = this.form.get('email');
    if (emailControl?.hasError('required')) {
      this.errorMessage.set('You must enter a value');
    } else if (emailControl?.hasError('email')) {
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
  get emailIsInvalid(): boolean {
    const emailControl = this.form.get('email');
    return (emailControl?.touched ?? false) && 
           (emailControl?.dirty ?? false) && 
           (emailControl?.invalid ?? false);
  }
  
  get passwordIsInvalid(): boolean {
    const passwordControl = this.form.get('password');
    return (passwordControl?.touched ?? false) && 
           (passwordControl?.dirty ?? false) && 
           (passwordControl?.invalid ?? false);
  }
  

  onSubmit(){
    const enteredName = this.form.get('name')?.value!;
    const enteredEmail = this.form.get('email')?.value!;
    const enteredPassword = this.form.get('password')?.value!;
    console.log("entered email: "+ enteredEmail);
    console.log("entered password: "+ enteredPassword);
    console.log(this.form.value);

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
