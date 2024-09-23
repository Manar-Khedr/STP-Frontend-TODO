import { TestBed } from "@angular/core/testing";
import { AuthService } from "./auth.service";
import { HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import { RouterTestingModule } from '@angular/router/testing';
import { Auth, AuthModule } from "@angular/fire/auth";
import { FirebaseAppModule } from "@angular/fire/app";
import { Router } from "@angular/router";
import { of } from "rxjs";
import { provideHttpClient } from '@angular/common/http';

describe('AuthService', () => {
    let service: AuthService;
    let mockAuth: jasmine.SpyObj<Auth>;
    let mockRouter: Router;
    let testingController: HttpTestingController;

    beforeEach(() => {
      // Create a mock for the Auth service
      const authSpy = jasmine.createSpyObj('Auth', ['signInWithEmailAndPassword', 'createUserWithEmailAndPassword']);
  
      TestBed.configureTestingModule({
        imports: [
          HttpClientTestingModule,  // For mocking HttpClient
          RouterTestingModule       // For mocking Angular Router
        ],
        providers: [
          AuthService,              // Service under test
          { provide: Auth, useValue: authSpy },  // Mock Auth with spy
          provideHttpClient(),      // Standalone way to provide HttpClient
          { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } }  // Mock Router's navigate method
        ]
      });
  
      // let ->inject
      service = TestBed.inject(AuthService);
      mockAuth = TestBed.inject(Auth) as jasmine.SpyObj<Auth>;
      mockRouter = TestBed.inject(Router);
      testingController = TestBed.inject(HttpTestingController);
    });
  
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    // it('should login in user from DUMMYUSERS', () => {
    //     const userEmail = 'manar@example.com';
    //     const password = 'manar123';
    //     const userId = '1';

    //     service.login(userEmail, password).subscribe({
    //         next: (userId) => {
    //             console.log('successful login');
    //             expect(userId).toBeTruthy();
    //             expect(userId).toBe('1');
    //         }
    //     });

    //     const mockReq = testingController.expectOne('https://firestore.googleapis.com/v1/projects/stp-todo/databases/(default)/documents/loginUsers');
    //     mockReq.flush(Object.values(userId));
    // });
  
   
  });
  