import { Injectable } from '@angular/core';
import { email } from '@angular/forms/signals';
import { Subject } from 'rxjs';

@Injectable({
    providedIn : 'root'
})

export class TranslationService
{
    currentLang: 'en' | 'sr' = 'en';

    LanguageChanged$ = new Subject<string>;

    private dictionary = {
        en: {
            appName: 'VetClinic',
            patients: 'Patient Registry',
            users: 'Staff Roster',
            logout: 'Logout',
            searchPlaceholder: 'Search by code or name...',
            allSpecies: 'All Species',
            code: 'Code',
            species: 'Species',
            dob: 'Date of Birth',
            gender: 'Gender',
            owner: 'Owner',
            activeProfile: 'Active profile',
            noRecords: 'No items matches your search parameters.',
            name: 'Name',
            phone: 'Phone',
            email: 'Email',
            licenceNumber: 'Licence number',
            role: 'Role',
            active: 'Active',
            allUsers: 'All users',
            err403: 'No permission to access data.',
            err0: 'Server error. Please Try again later.',
            errGeneric: 'Error while accessing data.',
            addPatient: 'Add patient',
            nameRequired: 'Name is required.',
            nameTooLong: 'Name is too long. (max 50 characters)',
            codeRequired: 'Code is required.',
            codeTooLong: 'Code is too long. (max 20 characters)',
            dobRequired: 'Date of birth is required.',
            ownerIdRequired: "Owner's name is required.",
            save: "Save",
            saving: 'Saving...',
            cancel: 'Cancel',
            login: 'Login',
            password: 'Password',
            loginMessage: 'Please enter email and password to login',
            errInvalidCredentials: 'Invalid email or password',
            happyAnimalMessage: 'Helthy animal is happy animal',
            delete: 'Delete',
            deleteConfirm: 'Are you sure you want to delete this profile?',
            edit: "Edit",
            chooseOwner: 'Select an owner',
            addAnimal: 'Add patient',
            editAnimal: 'Edit patient',
            inactiveProfile: "Inactive profile",
            showInactiveMessage: "Show Inactive Staff",
            registerUser: 'Register user',
            phoneRequired: 'Phone is required',
            phoneTooLong: 'Phone is too long',
            emailTooLong: 'Email is too long',
            emailRequired: 'Email is required',
            emailFormat: 'Email is in wrong format',
            licenceNotRequired: 'Not required for this role',
            fourDigits: "Must be exactly 4 characters",
            licenceRequired: 'Licence is required',
            addUser: 'Add user',
            confirmPassword: 'Confirm password',
            passwordsDoNotMatch: "Passwords do not match",
            chooseRole: 'Choose a role',
            passShort: 'Password too short',
            passLong: 'Password too long',
            passRequired: "Password required",
            medications: 'Medications',
            showMore: 'Show more',
            showLess: 'Show less',
            addMedication: 'Add Medication',
            err409: 'Code or licence must be unique',
            err400: "Email must be unique",
            description: 'Description',
            updateMedication: 'Update medication',
            diagnoses: 'Diagnoses',
            addDiagnose: 'Add diagnose',
            updateDiagnosis: 'Update dignosis' 


        },
        sr: {
            appName: 'VetKlinika',
            patients: 'Registar Pacijenata',
            users: 'Spisak Zaposlenih',
            logout: 'Odjava',
            searchPlaceholder: 'Pretraži po kodu ili imenu...',
            allSpecies: 'Sve Vrste',
            code: 'Kod',
            species: 'Vrsta',
            dob: 'Datum Rođenja',
            gender: 'Pol',
            owner: 'Vlasnik',
            activeProfile: 'Aktivni profil',
            noRecords: 'Nema stavki koje se poklapaju sa vašim parametrima pretrage.',
            name: 'Ime',
            phone: 'Telefon',
            email: 'Email',
            licenceNumber: 'Broj licence',
            role: 'Uloga',
            active: 'Aktivan',
            allUsers: 'Svi korisnici',
            err403: 'Nemate dozvolu da pristupite podacima.',
            err0: 'Serverska greška. Molim vas probajte kasnije.',
            errGeneric: 'Greška pri pristupanju podacima.',
            addPatient: 'Dodaj pacijenta',
            nameRequired: 'Ime je obavezno.',
            nameTooLong: 'Ime je predugačko. (Max 50 karaktera)',
            codeRequired: 'Kod je obavezan.',
            codeTooLong: 'Kod je predugačak. (max 20 karaktera)',
            dobRequired: 'Datum rođenja je obavezan.',
            ownerIdRequired: 'Ime vlasnika je obavezan.',
            save: "Snimi",
            saving: 'Snima se...',
            cancel: 'Odustani',
            login: 'Prijava',
            password: 'Šifra',
            loginMessage: 'Molimo unesite email i šifru da se prijavite.',
            errInvalidCredentials: 'Pogrešan email ili šifra',
            happyAnimalMessage: 'Zdrava životinja je srećna životinja',
            delete: 'Obriši',
            deleteConfirm: 'Da li ste sigurni da želite da obrišete ovaj profil?',
            edit: "Ažuriraj",
            chooseOwner: 'Izaberite vlasnika',
            addAnimal: 'Dodaj pacijenta',
            editAnimal: 'Ažuriraj pacijenta',
            inactiveProfile: "Neaktivan profil",
            showInactiveMessage: "Prikaži neaktivno osoblje",
            registerUser: 'Registruj korisnika',
            phoneRequired: 'Broj telefona je obavezan',
            phoneTooLong: 'Broj telefona je predugačak',
            emailTooLong: 'Email je predugacak',
            emailRequired: 'Email je obavezan',
            emailFormat: 'Email je u pogrešnom formatu',
            licenceNotRequired: 'Nije potrebna za ovu ulogu',
            fourDigits: "Mora biti tačno 4 karaktera",
            licenceRequired: 'Licenca je obavezna',
            addUser: 'Dodaj korisnika',
            confirmPassword: 'Potvrdite šifru',
            passwordsDoNotMatch: "Šifre se ne podudaraju",
            chooseRole: 'Izaberite ulogu',
            passShort: 'Šifra prekratka',
            passLong: 'Šifra predugačka',
            passRequired: "Šifra je obavezna",
            medications: 'Lekovi',
            showMore: 'Prikaži više',
            showLess: 'Prikaži manje',
            addMedication: 'Dodaj lek',
            err409: 'Kod ili licenca moraju biti jedinstveni',
            err400: "Email mora biti jedinstven",
            description: 'Opis',
            updateMedication: 'Ažuriraj lek',
            diagnoses: 'Dijagnoze',
            addDiagnose: 'Dodaj dijagnozu',
            updateDiagnosis: 'Ažuriraj dijagnozu' 

            
        }
    }

    get t()
    {
        return this.dictionary[this.currentLang];
    }

    toggleLanguage()
    {
        this.currentLang = this.currentLang === 'en' ? 'sr' : 'en';

        this.LanguageChanged$.next(this.currentLang);
    }

    getErrorMessage(errorKey: string | null): string
    {
        if(!errorKey)
        {
            return '';
        } 
        
        const activeDictionary = this.dictionary[this.currentLang] as Record<string,string>;
        return activeDictionary[errorKey] || '';
    }
    
}
