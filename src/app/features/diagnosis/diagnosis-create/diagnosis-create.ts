import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Diagnosis, DiagnosisService } from '../../../core/api/generated';
import { Router } from '@angular/router';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-diagnosis-create',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './diagnosis-create.html',
  styleUrl: './diagnosis-create.scss',
})
export class DiagnosisCreate implements OnInit, OnDestroy
{
  diagnosisForm!: FormGroup;

  errorMessage: string | null = null;
  isSaving: boolean = false;
  
  langSubscription: Subscription | null = null;

  constructor(
    private diagnosisService: DiagnosisService,
    private router: Router, 
    public translate: TranslationService, 
    private fb: FormBuilder, 
    private cdr: ChangeDetectorRef
  ){}

  ngOnInit(): void {
    this.diagnosisForm = this.fb.group({
      code: ['', [Validators.required, Validators.maxLength(10)]],
      name: ['', [Validators.required, Validators.maxLength(200)]]
    })

    this.langSubscription = this.translate.LanguageChanged$.subscribe(() => {
      this.cdr.detectChanges();
    });
  }

  getControl(name:string){
    return this.diagnosisForm.get(name);
  }

  saveDiagnosis(): void 
  {
      if (this.diagnosisForm.invalid)
      {
        this.diagnosisForm.markAllAsTouched();
        return;
      }
  
      this.errorMessage = null;
      this.isSaving = true;
  
      const formValue = this.diagnosisForm.value;
  
      const payload: Diagnosis = {
        name: formValue.name,
        code: formValue.code,
      }
  
      this.diagnosisService.createDignosis(payload).subscribe({
        next: () => {
          this.isSaving = false;
          this.router.navigate(['/diagnoses'])
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
  
    cancel(): void{
      this.router.navigate(['/diagnoses']);
    }
  
    ngOnDestroy(): void {
      if(this.langSubscription)
      {
        this.langSubscription.unsubscribe();
      }
    }
  
}
