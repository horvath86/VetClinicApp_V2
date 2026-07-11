import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
  Procedure,
  MedicalRecordResponseDTO
} from '../../../core/api/generated';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-medical-record-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './medical-record-edit.html',
  styleUrl: './medical-record-edit.scss'
})
export class MedicalRecordEdit implements OnInit, OnDestroy {
  recordForm!: FormGroup;
  errorMessage: string | null = null;
  isSaving: boolean = false;
  recordId!: number;

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
    private route: ActivatedRoute,
    private router: Router,
    public translate: TranslationService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();
    
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.recordId = Number(idParam);
      this.loadCatalogAndRecordData();
    }

    this.langSubscription = this.translate.LanguageChanged$.subscribe(() => {
      this.cdr.detectChanges();
    });
  }

  private initForm(): void {
    this.recordForm = this.fb.group({
      id: [null],
      animalId: ['', Validators.required],
      userId: ['', Validators.required],
      diagnosisId: ['', Validators.required],
      visitDate: ['', Validators.required],
      symptoms: ['', [Validators.required, Validators.maxLength(200)]],
      notes: ['', Validators.maxLength(200)],
      prescriptions: this.fb.array([]),
      procedureRecords: this.fb.array([])
    });
  }

  get prescriptions(): FormArray {
    return this.recordForm.get('prescriptions') as FormArray;
  }

  get procedureRecords(): FormArray {
    return this.recordForm.get('procedureRecords') as FormArray;
  }

  addPrescription(data?: any): void {
    this.prescriptions.push(this.fb.group({
      medicationId: [data?.medicationId || '', Validators.required],
      dosageInstructions: [data?.dosageInstructions || '', [Validators.required, Validators.maxLength(150)]]
    }));
    this.cdr.detectChanges();
  }

  removePrescription(index: number): void {
    this.prescriptions.removeAt(index);
    this.cdr.detectChanges();
  }

  addProcedure(data?: any): void {
    this.procedureRecords.push(this.fb.group({
      procedureId: [data?.procedureId || '', Validators.required],
      notes: [data?.notes || '', [Validators.required, Validators.maxLength(200)]],
      durationInMinutes: [data?.durationInMinutes || 15, [Validators.required, Validators.min(1)]],
      anesthesiaUsed: [data?.anesthesiaUsed || '', Validators.maxLength(100)]
    }));
    this.cdr.detectChanges();
  }

  removeProcedure(index: number): void {
    this.procedureRecords.removeAt(index);
    this.cdr.detectChanges();
  }

  private loadCatalogAndRecordData(): void {
    forkJoin({
      animals: this.animalService.getAnimals(),
      users: this.userService.getUsers(),
      diagnoses: this.diagnosisService.getDiagnoses(),
      medications: this.medicationService.getMedications(),
      procedures: this.procedureService.getProcedures(),
      record: this.recordService.getMedicalRecordById(this.recordId)
    }).subscribe({
      next: (res) => {
        this.animals = res.animals || [];
        this.diagnoses = res.diagnoses || [];
        this.medications = res.medications || [];
        this.procedures = res.procedures || [];

        //vets only
        this.vets = (res.users || []).filter(u => u.role === 1);

        this.populateForm(res.record);
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'errGeneric';
        this.cdr.detectChanges();
      }
    });
  }

  private populateForm(record: MedicalRecordResponseDTO): void {
    if (!record) return;

    this.recordForm.patchValue({
      id: this.recordId,
      animalId: record.animalId,
      userId: record.userId,
      diagnosisId: record.diagnosisId,
      visitDate: record.visitDate,
      symptoms: record.symptoms,
      notes: record.notes
    });

    this.prescriptions.clear();
    if (record.prescriptions) {
      record.prescriptions.forEach(p => this.addPrescription(p));
    }

    this.procedureRecords.clear();
    if (record.procedureRecords) {
      record.procedureRecords.forEach(pr => this.addProcedure(pr));
    }
  }

  updateRecord(): void {
    if (this.recordForm.invalid) {
      this.recordForm.markAllAsTouched();
      return;
    }

    this.errorMessage = null;
    this.isSaving = true;

    const payload = this.recordForm.value;

    this.recordService.updateMedicalRecord(payload as any).subscribe({
      next: () => {
        this.isSaving = false;
        this.router.navigate(['/medicalRecords']);
      },
      error: (err) => {
        this.isSaving = false;
        if (err.status === 409) this.errorMessage = 'err409';
        else if (err.status === 403) this.errorMessage = 'err403';
        else this.errorMessage = 'errGeneric';
        this.cdr.detectChanges();
      }
    });
  }

  getControl(name: string) {
    return this.recordForm.get(name);
  }

  cancel(): void {
    this.router.navigate(['/medicaRecords']);
  }

  ngOnDestroy(): void {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }
}
