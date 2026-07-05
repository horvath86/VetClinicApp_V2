import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Medication, MedicationService } from '../../../core/api/generated';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-medication-edit',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './medication-edit.html',
  styleUrl: './medication-edit.scss',
})
export class MedicationEdit implements OnInit, OnDestroy
{
  medicationForm!: FormGroup;
  errorMessage: string | null = null;
  isSaving: boolean = false;
  medicationId!: number;

  private langSubscription: Subscription | null = null;

  constructor(
    private medicationService: MedicationService,
    private router: Router,
    private route: ActivatedRoute,
    public translate: TranslationService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ){}

  ngOnInit(): void {
    this.medicationForm = this.fb.group({
      code: ['', [Validators.required, Validators.maxLength(10)]],
      name: ['', [Validators.required, Validators.maxLength(150)]],
      description: ['', [Validators.required, Validators.maxLength(250)]]
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if(idParam)
    {
      
      this.medicationId = Number(idParam);
      this.loadExistingMedicationData();
    }

    this.langSubscription = this.translate.LanguageChanged$.subscribe(() => {
      this.cdr.detectChanges();
    });
  }

  loadExistingMedicationData(): void {
    this.medicationService.getMedicationById(this.medicationId as any).subscribe({
          next:(medication: Medication) => {
          
            const data = medication;
    
            this.medicationForm.patchValue({
              name: data.name,
              code: data.code,
              description: data.description
            });
            this.cdr.detectChanges();
          },
          error: () => {
            this.errorMessage = 'errGeneric';
            this.cdr.detectChanges();
          }
        });
  }

  updateMedication(): void {
    if(this.medicationForm.invalid)
    {
      this.medicationForm.markAllAsTouched();
      return;
    }

    this.errorMessage = null;
    this.isSaving = true;

    const formValue = this.medicationForm.value;

    const payload = {
      id: this.medicationId,
      code: formValue.code,
      name: formValue.name,
      description: formValue.description
    }

    this.medicationService.updateMedication(payload as any).subscribe({
      next: () => {
        this.isSaving = false;
        this.router.navigate(['/medications']); 
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
    return this.medicationForm.get(name);
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
