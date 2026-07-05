import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { AnimalList } from './features/animal/animal-list/animal-list';
import { UserList } from './features/user/user-list/user-list';
import { AnimalCreate } from './features/animal/animal-create/animal-create';
import { authGuard } from './core/guards/auth-guard';
import { AnimalEdit } from './features/animal/animal-edit/animal-edit';
import { UserCreate } from './features/user/user-create/user-create';
import { UserEdit } from './features/user/user-edit/user-edit';
import { MedicationList } from './features/medication/medication-list/medication-list';
import { MedicationCreate } from './features/medication/medication-create/medication-create';
import { MedicationEdit } from './features/medication/medication-edit/medication-edit';

export const routes: Routes = [
    {path: '', redirectTo: 'login', pathMatch: 'full'},
    {path: 'login', component: Login},
    {path: 'animals', component: AnimalList, canActivate: [authGuard]},
    {path: 'animals/create', component: AnimalCreate, canActivate: [authGuard]},
    {path: 'animals/edit/:id', component: AnimalEdit, canActivate: [authGuard]},
    {path: 'users', component: UserList, canActivate: [authGuard]},
    {path: 'users/create', component: UserCreate, canActivate: [authGuard]},
    {path: 'users/edit/:id', component: UserEdit, canActivate: [authGuard]},
    {path: 'medications', component: MedicationList, canActivate: [authGuard]},
    {path: 'medications/create', component: MedicationCreate, canActivate: [authGuard]},
    {path: 'medications/edit/:id', component: MedicationEdit, canActivate: [authGuard]},
    {path: '**', redirectTo: 'login'}
];
