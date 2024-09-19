import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Observable, from, map, catchError, throwError, switchMap } from 'rxjs';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // inject auth and httpclient
  private auth = inject(Auth);
  private httpClient = inject(HttpClient);
  private firestoreUrl = 'https://firestore.googleapis.com/v1/projects/stp-todo/databases/(default)/documents/loginUsers';
  private router = inject(Router);
  userEmail = '';


  // login functions
  login(email: string, password: string): Observable<any> {
    console.log("Entered the login function");
    
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      map((userCredentials) => {
        const userId = userCredentials.user.uid;
        const userEmail = userCredentials.user.email;
        this.userEmail = email;
        const userPassword = userCredentials.user.providerData;
        console.log("email being authorized: " + userEmail);
  
        // Navigate to /tasks after successful login
        this.router.navigate(['/tasks']);
        
        return userId;
      }),
      catchError(err => throwError(() => new Error(err.message)))  // Handle any errors during login
    );
  }
  

  checkLoginUser(userId: string):Observable<any>{
    console.log("checking auth for user: "+userId);
    return this.httpClient.get(`${this.firestoreUrl}`); // change when login and signup
  }

  // signup functions
  // check if password is required
  addUserToFirestoreAuth(userId: string, email: string, name: string):Observable<any>{
    const userDocument = {
      fields: {
        firebaseUid: { stringValue: userId},
        name : { stringValue: name},
        email : { stringValue: email}
      }
    }

    return this.httpClient.post(`${this.firestoreUrl}`,userDocument).pipe(
      catchError(err => {
        console.error('Error adding user to Firestore:', err);
        return throwError(() => new Error('Failed to add user to Firestore.'));
      })
    );

  }

  signup(email: string, name: string, password: string): Observable<any> {
    return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap((userCredentials) => {
        const userId = userCredentials.user.uid;
  
        // Add details to Firestore and then navigate to /tasks
        return this.addUserToFirestoreAuth(userId, email, name).pipe(
          map(() => {
            // Navigate to /tasks once Firestore operation is complete
            this.router.navigate(['/tasks']);
            this.userEmail = email;
            return userId;
          }),
          catchError(err => throwError(() => err))
        );
      }),
      catchError(err => throwError(() => new Error(err.message)))
    );
  }
  


}
