import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnimalResponseDTO, AnimalService } from '../../../core/api/generated';
import { Gender, Species } from '../../../core/enums/clinic-enums';

@Component({
  selector: 'app-animal-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './animal-list.html',
  styleUrl: './animal-list.scss',
})
export class AnimalList implements OnInit {
  
  animals: AnimalResponseDTO[] = [];

  searchTerm: string = '';
  errorMessage : string | null = null;
  selectedSpecies: number | null = null;

  speciesOptions = Object.values(Species).filter(v => typeof v === 'string')as string[];
  genderOptions = Object.values(Gender);

  constructor(private animalService : AnimalService, private cdr: ChangeDetectorRef)
  {

  }

  ngOnInit(): void {
    this.loadAnimals();
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
          if(err.status === 403)
          {
            this.errorMessage = "No permission to access data";
          }
          else if(err.status === 0)
          {
            this.errorMessage = "Server error. Please Try again later.";
          }
          else
          {
            this.errorMessage = "Error while fetching animal data.";
          }

        }
      });
  }

 
}
