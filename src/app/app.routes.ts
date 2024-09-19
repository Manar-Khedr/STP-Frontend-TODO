import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';

export const routes: Routes = [
    {
        path: '', // LOGIN PAGE ON DEFAULT ROUTE
        component: LoginComponent
    },
    {
        path: 'signup',
        loadComponent: () => import('./auth/signup/signup.component').then((mod) => mod.SignupComponent)
    },
    {
        path: 'tasks', // lazy load the todo list
        loadComponent: () => import('./column/column.component').then((mod) => mod.ColumnComponent)
    }
];
