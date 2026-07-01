import { ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Gender, Species } from '../../../core/enums/clinic-enums';
import { Router } from '@angular/router';
import { TranslationService } from '../../../core/services/translation.service';
import { AnimalCreateDTO } from '../../../core/api/generated/model/animalCreateDTO';
import { AnimalService } from '../../../core/api/generated/api/animal.service';
import { Subscription } from 'rxjs';
import { OwnerResponseDTO, OwnerService } from '../../../core/api/generated';

@Component({
  selector: 'app-animal-create',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './animal-create.html',
  styleUrl: './animal-create.scss',
})
export class AnimalCreate implements OnInit, OnDestroy{

  patientForm!: FormGroup;

  errorMessage : string | null = null;
  isSaving: boolean = false;

  ownersList: OwnerResponseDTO[] = [];

  langSubscription: Subscription | null = null;

  speciesOptions = Object.values(Species).filter(v => typeof v === 'string') as string[];
  genderOptions = Object.values(Gender).filter(v => typeof v === 'string') as string[];

  constructor(private ownerService: OwnerService,private animalService: AnimalService, private router: Router, public translate: TranslationService, private fb:FormBuilder, private cdr: ChangeDetectorRef){}

  ngOnInit(): void {
    this.patientForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      code: ['', [Validators.required, Validators.maxLength(20)]],
      species: [0, [Validators.required]],
      dateOfBirth: ['', [Validators.required]],
      gender: [0, [Validators.required]],
      ownerId: [null, [Validators.required]]
    })

    this.loadOwners();

    this.langSubscription = this.translate.LanguageChanged$.subscribe(() => {
      this.cdr.detectChanges();
    });
  }

  loadOwners(): void {
    this.ownerService.getOwners().subscribe({
      next: (response: OwnerResponseDTO[]) => {
        this.ownersList = response;
        this.cdr.detectChanges();
      },
      error: () => {
        console.error("Failed to populate active clinic owners dropdown.");
      }
    });
  }

  getControl(name:string){
    return this.patientForm.get(name);
  }

  savePatient(): void
  {
    if(this.patientForm.invalid)
    {
      this.patientForm.markAllAsTouched();
      return;
    }

    this.errorMessage = null;
    this.isSaving = true;

    const formValue = this.patientForm.value;

    const payload: AnimalCreateDTO = {
      name: formValue.name,
      code: formValue.code,
      species: Number(formValue.species), 
      gender: Number(formValue.gender),
      ownerId: Number(formValue.ownerId),
      dateOfBirth: formValue.dateOfBirth 
    };

    this.animalService.createAnimal(payload).subscribe({
      next: () => {
        this.isSaving = false;
        this.router.navigate(['/animals'])
      },
      error: (err) => {
        this.isSaving = false;
        if (err.status === 403) this.errorMessage = 'err403';
        else if (err.status === 0) this.errorMessage = 'err0';
        else this.errorMessage = 'errGeneric';
      }
    });
  }

  cancel(): void{
    this.router.navigate(['/animals']);
  }
  
  ngOnDestroy(): void {
    if(this.langSubscription)
    {
      this.langSubscription.unsubscribe();
    }
  }
}
