import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Procedure, ProcedureService } from '../../../core/api/generated';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-procedure-edit',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './procedure-edit.html',
  styleUrl: './procedure-edit.scss',
})
export class ProcedureEdit implements OnInit, OnDestroy
{
  procedureForm!: FormGroup;
  errorMessage: string | null = null;
  isSaving: boolean = false;
  procedureId!: number;

  private langSubscription: Subscription | null = null;

  constructor(
    private procedureService: ProcedureService,
    private router: Router,
    private route: ActivatedRoute,
    public translate: TranslationService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ){}

  ngOnInit(): void {
    this.procedureForm = this.fb.group({
      code: ['', [Validators.required, Validators.maxLength(10)]],
      name: ['', [Validators.required, Validators.maxLength(200)]]
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if(idParam)
    {
      
      this.procedureId = Number(idParam);
      this.loadExistingProcedureData();
    }

    this.langSubscription = this.translate.LanguageChanged$.subscribe(() => {
      this.cdr.detectChanges();
    });
  }

  loadExistingProcedureData(): void {
    this.procedureService.getProcedureById(this.procedureId as any).subscribe({
          next:(procedure: Procedure) => {
          
            const data = procedure;
    
            this.procedureForm.patchValue({
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

  updateProcedure(): void {
    if(this.procedureForm.invalid)
    {
      this.procedureForm.markAllAsTouched();
      return;
    }

    this.errorMessage = null;
    this.isSaving = true;

    const formValue = this.procedureForm.value;

    const payload = {
      id: this.procedureId,
      code: formValue.code,
      name: formValue.name
    }

    this.procedureService.updateProcedure(payload as any).subscribe({
      next: () => {
        this.isSaving = false;
        this.router.navigate(['/procedures']); 
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
    return this.procedureForm.get(name);
  }

  cancel(): void {
    this.router.navigate(['/procedures']);
  }

  ngOnDestroy(): void {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }
}
