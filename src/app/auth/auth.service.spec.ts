import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from './auth.service';
import { Auth, UserCredential } from '@angular/fire/auth';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';


describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let authSpy: jasmine.SpyObj<Auth>;
  let router: Router;

  beforeEach(() => {
    const authSpyObj = jasmine.createSpyObj('Auth', ['currentUser']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']); // Mock Router
    
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        AuthService,
        { provide: Auth, useValue: authSpyObj },
        { provide: Router, useValue: routerSpy }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    authSpy = TestBed.inject(Auth) as jasmine.SpyObj<Auth>;
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('checkLoginUser', () => {
    it('should check login for the given user', (done) => {
      const userId = 'testUser';
      const mockResponse = { success: true };
  
      // Call the method
      service.checkLoginUser(userId).subscribe((response) => {
        expect(response).toEqual(mockResponse);
        console.log('entered the response: ',response);
        done(); // Indicate that the async test has finished
      });
  
      // Expect an HTTP request
      const req = httpMock.expectOne(service.firestoreUrl);
      expect(req.request.method).toBe('GET');
  
      // Respond with the mock data
      req.flush(mockResponse);
    });
  });

  describe('login', () => {
    it('should login successfully and navigate to /tasks', (done) => {
      const email = 'test@example.com';
      const password = 'testpassword';
      const mockUserCredentials = {
        user: {
          uid: '12345',
          email: 'test@example.com',
          providerData: ['password'],
        },
      };
  
      // Spy on the firebaseLogin method instead of signInWithEmailAndPassword directly
      spyOn(service, 'firebaseLogin').and.returnValue(of(mockUserCredentials));
  
      // Call the login method
      service.login(email, password).subscribe((userId) => {
        console.log('the received userId in TESTING: ', userId);
        expect(userId).toEqual('12345');
        expect(service.userEmail).toEqual(email);
        expect(router.navigate).toHaveBeenCalledWith(['/tasks']);
        done(); // Mark the async test as complete
      });
    });

    it('should handle login error', (done) => {
      const email = 'test@example.com';
      const password = 'testpassword';
      const mockError = { message: 'Login failed' };
  
      spyOn(service, 'firebaseLogin').and.returnValue(throwError(() => mockError));
  
      service.login(email, password).subscribe({
        error: (error) => {
          expect(error.message).toEqual('Login failed');
          done(); // Mark the async test as complete
        },
      });
    });
  });


  describe('signup', () => {
    it('should signup successfully and navigate to /tasks', (done) => {
      const email = 'test@example.com';
      const name = 'Test User';
      const password = 'testpassword';
      const mockUserCredentials = {
        user: {
          uid: '12345',
          email: 'test@example.com',
        },
      };

      spyOn(service, 'firebaseSignup').and.returnValue(of(mockUserCredentials));
  
      spyOn(service, 'addUserToFirestoreAuth').and.returnValue(of({}));
  
      service.signup(email, name, password).subscribe((userId) => {
        expect(userId).toEqual('12345');
        expect(service.userEmail).toEqual(email);
        expect(router.navigate).toHaveBeenCalledWith(['/tasks']);
        done(); // Mark the async test as complete
      });
    });

    it('should handle signup error from Firebase', (done) => {
      const email = 'test@example.com';
      const name = 'Test User';
      const password = 'testpassword';
      const mockError = { message: 'Signup failed' };
  
      spyOn(service, 'firebaseSignup').and.returnValue(throwError(() => mockError));
  
      service.signup(email, name, password).subscribe({
        error: (error) => {
          expect(error.message).toEqual('Signup failed');
          done(); // Mark the async test as complete
        },
      });
    });

    it('should handle Firestore error', (done) => {
      const email = 'test@example.com';
      const name = 'Test User';
      const password = 'testpassword';
      const mockUserCredentials = {
        user: {
          uid: '12345',
          email: 'test@example.com',
        },
      };
      const mockFirestoreError = { message: 'Firestore error' };
  
      spyOn(service, 'firebaseSignup').and.returnValue(of(mockUserCredentials));
  
      spyOn(service, 'addUserToFirestoreAuth').and.returnValue(throwError(() => mockFirestoreError));

      service.signup(email, name, password).subscribe({
        error: (error) => {
          expect(error.message).toEqual('Firestore error');
          done(); // Mark the async test as complete
        },
      });
    });
  });
});