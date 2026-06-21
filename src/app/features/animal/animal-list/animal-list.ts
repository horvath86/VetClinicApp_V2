import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnimalResponseDTO, AnimalService } from '../../../core/api/generated';
import { Species } from '../../../core/enums/clinic-enums';

@Component({
  selector: 'app-animal-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './animal-list.html',
  styleUrl: './animal-list.scss',
})
export class AnimalList implements OnInit {
  
  animals: AnimalResponseDTO[] = [];

  searchTerm: string = '';
  selectedSpecies: Species | null = null;

  speciesOptions = Object.values(Species);

  errorMessage : string | null = null;

  constructor(private animalService : AnimalService)
  {

  }

  ngOnInit(): void {
    this.loadAnimals();
  }

  loadAnimals(): void {
    this.animalService.getAnimals(this.searchTerm || undefined, (this.selectedSpecies as any) || undefined)
      .subscribe({
        next: (data) => {
          this.animals = data;
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
