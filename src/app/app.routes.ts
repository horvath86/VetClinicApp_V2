import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { AnimalList } from './features/animal/animal-list/animal-list';

export const routes: Routes = [
    {path: '', component: Login},
    {path: 'login', component: Login},
    {path: 'animals', component: AnimalList},
    {path: '**', redirectTo: ''}
];
