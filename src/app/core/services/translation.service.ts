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
            noRecords: 'No animal patient matches your search parameters.'
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
            noRecords: 'Nema pacijenata koji se poklapaju sa vašim parametrima pretrage.'
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
}
