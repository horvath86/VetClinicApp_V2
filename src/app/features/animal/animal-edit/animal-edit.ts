import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AnimalResponseDTO, AnimalService, OwnerResponseDTO, OwnerService } from '../../../core/api/generated';
import { ActivatedRoute, isActive, Router } from '@angular/router';
import { TranslationService } from '../../../core/services/translation.service';
import { Subscription } from 'rxjs';
import { Gender, Species } from '../../../core/enums/clinic-enums';

@Component({
  selector: 'app-animal-edit',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './animal-edit.html',
  styleUrl: './animal-edit.scss',
})
export class AnimalEdit implements OnInit, OnDestroy{

  patientForm!: FormGroup;
  errorMessage: string | null = null;
  isSaving: boolean = false;
  animalId!: number;

  ownerList: OwnerResponseDTO[] = [];

  private langSubscription: Subscription | null = null;
  speciesOptions = Object.values(Species).filter(v => typeof v === 'string') as string[];
  genderOptions = Object.values(Gender).filter(v => typeof v === 'string') as string[];

  constructor(
    private animalService: AnimalService,
    private ownerService: OwnerService,
    private router: Router,
    private route : ActivatedRoute,
    public translate: TranslationService,
    private fb : FormBuilder,
    private cdr: ChangeDetectorRef
  ){}

  ngOnInit(): void {
    this.patientForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      code: ['', [Validators.required, Validators.maxLength(20)]],
      species: [0, [Validators.required]],
      dateOfBirth: ['', [Validators.required]],
      gender: [0, [Validators.required]],
      ownerId: [null, [Validators.required, Validators.min(1)]]
    });

    this.loadOwners();

    const idParam = this.route.snapshot.paramMap.get('id');
    if(idParam)
    {
      this.animalId = Number(idParam);
      this.loadExistingPatientData();
    }

    this.langSubscription = this.translate.LanguageChanged$.subscribe(() => {
      this.cdr.detectChanges();
    });
  }

  loadOwners(): void {
    this.ownerService.getOwners().subscribe({
      next: (response: OwnerResponseDTO[]) => {
        this.ownerList = response;
        this.cdr.detectChanges();
      },
      error: () => {
        console.error("Failed to populate owners dropdown");
      }
    });
  }

  loadExistingPatientData(): void {
    this.animalService.getAnimalById(this.animalId as any).subscribe({
      next:(animal: AnimalResponseDTO) => {
      
        const data = animal;

        this.patientForm.patchValue({
          name: data.name,
          code: data.code,
          species: data.species,
          dateOfBirth: data.dateOfBirth,
          gender: data.gender,
          ownerId: data.ownerId
        });
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'errGeneric';
        this.cdr.detectChanges();
      }
    });
  }

  getControl(name: string) {
    return this.patientForm.get(name);
  }

  updatePatient(): void {
    if(this.patientForm.invalid)
    {
      this.patientForm.markAllAsTouched();
      return;
    }

    this.errorMessage = null;
    this.isSaving = true;

    const formValue = this.patientForm.value;

    const payload = {
      ...formValue,
      id: this.animalId,
      species: Number(formValue.species),
      gender: Number(formValue.gender),
      ownerId: Number(formValue.ownerId)
    };

    this.animalService.updateAnimal(payload as any).subscribe({
      next: () => {
        this.isSaving = false;
        this.router.navigate(['/animals']); 
      },
      error: (err) => {
        this.isSaving = false;
        if (err.status === 403) this.errorMessage = 'err403';
        else if (err.status === 0) this.errorMessage = 'err0';
        else if (err.status === 409) this.errorMessage = 'err409';
        else this.errorMessage = 'errGeneric';
        this.cdr.detectChanges();
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/animals']);
  }

  ngOnDestroy(): void {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }
}
