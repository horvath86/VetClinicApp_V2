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

  speciesOptions = [
    {name: 'Canine', value: 0},
    {name: 'Feline', value: 1},
    {name: 'Avian', value: 2},
    {name: 'Equine', value: 3}
  ];

  genderOptions = ['Male', 'Female'];

  

  constructor(private animalService : AnimalService, private cdr: ChangeDetectorRef)
  {

  }

  ngOnInit(): void {
    this.loadAnimals();
  }

  loadAnimals(dropdownValue?: string): void {
    this.errorMessage = null;

    if(dropdownValue !== undefined)
    {
      this.selectedSpecies = dropdownValue === 'null' ? null : Number(dropdownValue);
    }
 
    const speciesFilter = this.selectedSpecies !== null ? this.selectedSpecies : undefined;

    console.log("Frontend is sending multiplexed query id:", speciesFilter);

    this.animalService.getAnimals(this.searchTerm || undefined, speciesFilter as any)
      .subscribe({
        next: (data) => {
          this.animals = data;
          this.cdr.detectChanges();
          console.log("raw net backend payload returned:", JSON.stringify(data));
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

  getSpeciesName(speciesValue: any): string
  {
    if(speciesValue === null || speciesValue === undefined || speciesValue === '')
    {
      return 'Unknown';
    }

    const match = this.speciesOptions.find(opt => opt.value === speciesValue);
    return match ? match.name : 'Unknown';
  }

 
}
