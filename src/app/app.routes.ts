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
import { DiagnosisList } from './features/diagnosis/diagnosis-list/diagnosis-list';
import { DiagnosisCreate } from './features/diagnosis/diagnosis-create/diagnosis-create';
import { DiagnosisEdit } from './features/diagnosis/diagnosis-edit/diagnosis-edit';
import { ProcedureList } from './features/procedure/procedure-list/procedure-list';
import { ProcedureCreate } from './features/procedure/procedure-create/procedure-create';
import { ProcedureEdit } from './features/procedure/procedure-edit/procedure-edit';
import { MedicalRecordList } from './features/medical-record/medical-record-list/medical-record-list';
import { MedicalRecordCreate } from './features/medical-record/medical-record-create/medical-record-create';
import { MedicalRecordEdit } from './features/medical-record/medical-record-edit/medical-record-edit';
import { MedicalRecordDetails } from './features/medical-record/medical-record-details/medical-record-details';

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
    {path: 'diagnoses', component: DiagnosisList, canActivate: [authGuard]},
    {path: 'diagnoses/create', component: DiagnosisCreate, canActivate: [authGuard]},
    {path: 'diagnoses/edit/:id', component: DiagnosisEdit, canActivate: [authGuard]},
    {path: 'procedures', component: ProcedureList, canActivate: [authGuard]},
    {path: 'procedures/create', component: ProcedureCreate, canActivate: [authGuard]},
    {path: 'procedures/edit/:id', component: ProcedureEdit, canActivate: [authGuard]},
    {path: 'medicalRecords', component: MedicalRecordList, canActivate: [authGuard]},
    {path: 'medicalRecords/create', component: MedicalRecordCreate, canActivate: [authGuard]},
    {path: 'medicalRecords/edit/:id', component: MedicalRecordEdit, canActivate: [authGuard]},
    {path: 'medicalRecords/details/:id', component: MedicalRecordDetails, canActivate: [authGuard]},
    {path: '**', redirectTo: 'login'}
];
