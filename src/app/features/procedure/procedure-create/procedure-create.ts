import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Procedure, ProcedureService } from '../../../core/api/generated';
import { Router } from '@angular/router';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-procedure-create',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './procedure-create.html',
  styleUrl: './procedure-create.scss',
})
export class ProcedureCreate implements OnInit, OnDestroy
{
  procedureForm!: FormGroup;

  errorMessage: string | null = null;
  isSaving: boolean = false;
  
  langSubscription: Subscription | null = null;

  constructor(
    private procedureService: ProcedureService,
    private router: Router, 
    public translate: TranslationService, 
    private fb: FormBuilder, 
    private cdr: ChangeDetectorRef
  ){}

  ngOnInit(): void {
    this.procedureForm = this.fb.group({
      code: ['', [Validators.required, Validators.maxLength(10)]],
      name: ['', [Validators.required, Validators.maxLength(200)]]
    })

    this.langSubscription = this.translate.LanguageChanged$.subscribe(() => {
      this.cdr.detectChanges();
    });
  }

  getControl(name:string){
    return this.procedureForm.get(name);
  }

  saveProcedure(): void 
  {
      if (this.procedureForm.invalid)
      {
        this.procedureForm.markAllAsTouched();
        return;
      }
  
      this.errorMessage = null;
      this.isSaving = true;
  
      const formValue = this.procedureForm.value;
  
      const payload: Procedure = {
        name: formValue.name,
        code: formValue.code,
      }
  
      this.procedureService.createProcedure(payload).subscribe({
        next: () => {
          this.isSaving = false;
          this.router.navigate(['/procedures'])
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
      this.router.navigate(['/procedures']);
    }
  
    ngOnDestroy(): void {
      if(this.langSubscription)
      {
        this.langSubscription.unsubscribe();
      }
    }
}
