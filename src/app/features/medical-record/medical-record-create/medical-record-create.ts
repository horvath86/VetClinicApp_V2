import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subscription, forkJoin } from 'rxjs';
import { 
  MedicalRecordService, 
  AnimalService, 
  UserService, 
  DiagnosisService, 
  MedicationService, 
  ProcedureService,
  AnimalResponseDTO,
  UserResponseDTO,
  Diagnosis,
  Medication,
  Procedure
} from '../../../core/api/generated';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-medical-record-create',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './medical-record-create.html',
  styleUrl: './medical-record-create.scss'
})
export class MedicalRecordCreate implements OnInit, OnDestroy {
  recordForm!: FormGroup;
  errorMessage: string | null = null;
  isSaving: boolean = false;

  // Catalog selection data drops
  animals: AnimalResponseDTO[] = [];
  vets: UserResponseDTO[] = [];
  diagnoses: Diagnosis[] = [];
  medications: Medication[] = [];
  procedures: Procedure[] = [];

  private langSubscription: Subscription | null = null;

  constructor(
    private recordService: MedicalRecordService,
    private animalService: AnimalService,
    private userService: UserService,
    private diagnosisService: DiagnosisService,
    private medicationService: MedicationService,
    private procedureService: ProcedureService,
    private router: Router,
    public translate: TranslationService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCatalogDropdowns();

    this.langSubscription = this.translate.LanguageChanged$.subscribe(() => {
      this.cdr.detectChanges();
    });
  }

  private initForm(): void {
    this.recordForm = this.fb.group({
      animalId: ['', Validators.required],
      userId: ['', Validators.required],
      diagnosisId: ['', Validators.required],
      visitDate: [new Date().toISOString().substring(0, 10), Validators.required], // Autofills today's date cleanly
      symptoms: ['', [Validators.required, Validators.maxLength(200)]],
      notes: ['', Validators.maxLength(200)],
      prescriptions: this.fb.array([]),
      procedureRecords: this.fb.array([])
    });
  }

  // FormArray getters
  get prescriptions(): FormArray {
    return this.recordForm.get('prescriptions') as FormArray;
  }

  get procedureRecords(): FormArray {
    return this.recordForm.get('procedureRecords') as FormArray;
  }

  // Add sub-item entries dynamically
  addPrescription(): void {
    const pGroup = this.fb.group({
      medicationId: ['', Validators.required],
      dosageInstructions: ['', [Validators.required, Validators.maxLength(150)]]
    });
    this.prescriptions.push(pGroup);
    this.cdr.detectChanges();
  }

  removePrescription(index: number): void {
    this.prescriptions.removeAt(index);
    this.cdr.detectChanges();
  }

  addProcedure(): void {
    const prGroup = this.fb.group({
      procedureId: ['', Validators.required],
      notes: ['', [Validators.required, Validators.maxLength(200)]],
      durationInMinutes: [15, [Validators.required, Validators.min(1)]],
      anesthesiaUsed: ['', Validators.maxLength(100)]
    });
    this.procedureRecords.push(prGroup);
    this.cdr.detectChanges();
  }

  removeProcedure(index: number): void {
    this.procedureRecords.removeAt(index);
    this.cdr.detectChanges();
  }

  private loadCatalogDropdowns(): void {
    forkJoin({
      animals: this.animalService.getAnimals(),
      vets: this.userService.getUsers(),
      diagnoses: this.diagnosisService.getDiagnoses(),
      medications: this.medicationService.getMedications(),
      procedures: this.procedureService.getProcedures()
    }).subscribe({
      next: (res) => {
        this.animals = res.animals || [];
        this.vets = res.vets || [];
        this.diagnoses = res.diagnoses || [];
        this.medications = res.medications || [];
        this.procedures = res.procedures || [];

        this.vets = (res.vets || []).filter(user => {
        return user.role === 1; 
      });
        
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'errGeneric';
        this.cdr.detectChanges();
      }
    });
  }

  saveRecord(): void {
    if (this.recordForm.invalid) {
      this.recordForm.markAllAsTouched();
      return;
    }

    this.errorMessage = null;
    this.isSaving = true;

    // Direct object mapping matching your C# create payload requirements
    const payload = this.recordForm.value;

    this.recordService.createMedicalRecord(payload as any).subscribe({
      next: () => {
        this.isSaving = false;
        this.router.navigate(['/medicalRecords']);
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

  getControl(name: string) {
    return this.recordForm.get(name);
  }

  cancel(): void {
    this.router.navigate(['/medicalRecords']);
  }

  ngOnDestroy(): void {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }
}