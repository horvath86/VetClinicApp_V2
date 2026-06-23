import { Injectable } from '@angular/core';
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
            errGeneric: 'Error while fetching data.'
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
            errGeneric: 'Greška pri dobavljanju podataka.'
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
