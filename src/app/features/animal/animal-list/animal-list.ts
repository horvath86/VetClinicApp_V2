import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnimalResponseDTO, AnimalService } from '../../../core/api/generated';
import { Gender, Species } from '../../../core/enums/clinic-enums';
import { TranslationService } from '../../../core/services/translation.service';
import { Subscription } from 'rxjs';
import { RouterLink, RouterModule } from "@angular/router";

@Component({
  selector: 'app-animal-list',
  imports: [CommonModule, FormsModule, RouterLink, RouterModule],
  templateUrl: './animal-list.html',
  styleUrl: './animal-list.scss',
})
export class AnimalList implements OnInit, OnDestroy{
  
  animals: AnimalResponseDTO[] = [];

  searchTerm: string = '';
  errorMessage : string | null = null;
  selectedSpecies: number | null = null;

  speciesOptions = Object.values(Species).filter(v => typeof v === 'string')as string[];
  genderOptions = Object.values(Gender);

  langSubscription: Subscription | null = null;

  constructor(private animalService : AnimalService, private cdr: ChangeDetectorRef, public translation: TranslationService)
  {

  }

  ngOnInit(): void {
    this.loadAnimals();

    this.langSubscription = this.translation.LanguageChanged$.subscribe(() => {
      this.cdr.detectChanges();
    });
  }

  loadAnimals(): void {
    this.errorMessage = null;
 
    const speciesFilter = this.selectedSpecies !== null ? this.selectedSpecies : undefined;

    this.animalService.getAnimals(this.searchTerm || undefined, speciesFilter as any)
      .subscribe({
        next: (data) => {
          this.animals = data;
          //force detect change because of bug with rendering page with correct animals
          this.cdr.detectChanges();
        },
        error: (err) => {
          if (err.status === 403) this.errorMessage = 'err403';
          else if (err.status === 0) this.errorMessage = 'err0';
          else this.errorMessage = 'errGeneric';
        }
      });
  }

  ngOnDestroy(): void {
    if(this.langSubscription)
    {
      this.langSubscription.unsubscribe();
    }
  }

 
}
