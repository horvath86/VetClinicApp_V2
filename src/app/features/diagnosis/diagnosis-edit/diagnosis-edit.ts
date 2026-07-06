import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Diagnosis, DiagnosisService } from '../../../core/api/generated';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-diagnosis-edit',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './diagnosis-edit.html',
  styleUrl: './diagnosis-edit.scss',
})
export class DiagnosisEdit implements OnInit, OnDestroy
{
  diagnosisForm!: FormGroup;
  errorMessage: string | null = null;
  isSaving: boolean = false;
  diagnosisId!: number;

  private langSubscription: Subscription | null = null;

  constructor(
    private diagnosisService: DiagnosisService,
    private router: Router,
    private route: ActivatedRoute,
    public translate: TranslationService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ){}

  ngOnInit(): void {
    this.diagnosisForm = this.fb.group({
      code: ['', [Validators.required, Validators.maxLength(10)]],
      name: ['', [Validators.required, Validators.maxLength(200)]]
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if(idParam)
    {
      
      this.diagnosisId = Number(idParam);
      this.loadExistingDiagnosisData();
    }

    this.langSubscription = this.translate.LanguageChanged$.subscribe(() => {
      this.cdr.detectChanges();
    });
  }

  loadExistingDiagnosisData(): void {
    this.diagnosisService.getDiagnosisById(this.diagnosisId as any).subscribe({
          next:(diagnosis: Diagnosis) => {
          
            const data = diagnosis;
    
            this.diagnosisForm.patchValue({
              name: data.name,
              code: data.code,
            });
            this.cdr.detectChanges();
          },
          error: () => {
            this.errorMessage = 'errGeneric';
            this.cdr.detectChanges();
          }
        });
  }

  updateDiagnosis(): void {
    if(this.diagnosisForm.invalid)
    {
      this.diagnosisForm.markAllAsTouched();
      return;
    }

    this.errorMessage = null;
    this.isSaving = true;

    const formValue = this.diagnosisForm.value;

    const payload = {
      id: this.diagnosisId,
      code: formValue.code,
      name: formValue.name
    }

    this.diagnosisService.updateDiagnosis(payload as any).subscribe({
      next: () => {
        this.isSaving = false;
        this.router.navigate(['/diagnoses']); 
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
    return this.diagnosisForm.get(name);
  }

  cancel(): void {
    this.router.navigate(['/diagnoses']);
  }

  ngOnDestroy(): void {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }
}
