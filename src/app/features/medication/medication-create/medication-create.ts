import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Medication, MedicationService } from '../../../core/api/generated';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-medication-create',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './medication-create.html',
  styleUrl: './medication-create.scss',
})
export class MedicationCreate implements OnInit, OnDestroy
{
  medicationForm!: FormGroup;

  errorMessage: string | null = null;
  isSaving: boolean = false;

  langSubscription: Subscription | null = null;

  constructor(private medicationService: MedicationService, private router: Router, public translate: TranslationService, private fb: FormBuilder, private cdr: ChangeDetectorRef){}

  ngOnInit(): void {
    this.medicationForm = this.fb.group({
      code: ['', [Validators.required, Validators.maxLength(10)]],
      name: ['', [Validators.required, Validators.maxLength(150)]],
      description: ['', [Validators.required, Validators.maxLength(250)]]
    })

    this.langSubscription = this.translate.LanguageChanged$.subscribe(() => {
      this.cdr.detectChanges();
    });
  }

  getControl(name:string){
    return this.medicationForm.get(name);
  }

  saveMedication(): void 
  {
    if (this.medicationForm.invalid)
    {
      this.medicationForm.markAllAsTouched();
      return;
    }

    this.errorMessage = null;
    this.isSaving = true;

    const formValue = this.medicationForm.value;

    const payload: Medication = {
      name: formValue.name,
      code: formValue.code,
      description: formValue.description
    }

    this.medicationService.createMedication(payload).subscribe({
      next: () => {
        this.isSaving = false;
        this.router.navigate(['/medications'])
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
    this.router.navigate(['/medications']);
  }

  ngOnDestroy(): void {
    if(this.langSubscription)
    {
      this.langSubscription.unsubscribe();
    }
  }
}
