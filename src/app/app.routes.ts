import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { AnimalList } from './features/animal/animal-list/animal-list';
import { UserList } from './features/user/user-list/user-list';
import { AnimalCreate } from './features/animal/animal-create/animal-create';
import { authGuard } from './core/guards/auth-guard';
import { AnimalEdit } from './features/animal/animal-edit/animal-edit';

export const routes: Routes = [
    {path: '', redirectTo: 'login', pathMatch: 'full'},
    {path: 'login', component: Login},
    {path: 'animals', component: AnimalList, canActivate: [authGuard]},
    {path: 'animals/create', component: AnimalCreate, canActivate: [authGuard]},
    {path: 'animals/edit/:id', component: AnimalEdit, canActivate: [authGuard]},
    {path: 'users', component: UserList, canActivate: [authGuard]},
    {path: '**', redirectTo: 'login'}
];
