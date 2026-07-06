import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Diagnosis, DiagnosisService } from '../../../core/api/generated';
import { Subscription } from 'rxjs';
import { TranslationService } from '../../../core/services/translation.service';

interface DiagnosisVM extends Diagnosis
{
  isExpanded?: boolean;
}

@Component({
  selector: 'app-diagnosis-list',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './diagnosis-list.html',
  styleUrl: './diagnosis-list.scss',
})
export class DiagnosisList implements OnInit, OnDestroy
{
  diagnoses: DiagnosisVM[] = [];
  errorMessage: string | null = null;
  langSubscription: Subscription | null = null;
  searchTerm: string = '';

  constructor(
    private diagnosisService: DiagnosisService,
    public translate: TranslationService,
    private cdr: ChangeDetectorRef
  ){}

  ngOnInit(): void {
    this.loadDiagnoses()

    this.langSubscription = this.translate.LanguageChanged$.subscribe(() => {
      this.cdr.detectChanges();
    });
  }


    loadDiagnoses(): void{
      this.errorMessage = null;
  
      this.diagnosisService.getDiagnoses(this.searchTerm || undefined).subscribe({
        next: (data: Diagnosis[]) => {
          this.diagnoses = data.map(diag => {
            const clonedDiag = JSON.parse(JSON.stringify(diag));
            return {
              ...clonedDiag,
              isExpanded:false
            };
          });
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          if (err.status === 403) this.errorMessage = 'err403';
          else if (err.status === 0) this.errorMessage = 'err0';
          else this.errorMessage = 'errGeneric';
          this.cdr.detectChanges();
        }
      });  
    }

  ngOnDestroy(): void {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }

  toggleExpand(diag: DiagnosisVM): void {
    diag.isExpanded = !diag.isExpanded;
    this.cdr.detectChanges();
  }

  deleteDiagnosis(id: any, event: Event)
  {
    //stops click event from bubbling to parent
    event.stopPropagation();
    const localizedMessage = this.translate.t.deleteConfirm;
    const confirmDelete = confirm(localizedMessage);

    if(!confirmDelete)
    {
      return;
    }

    const rawNumberId = id.id ? id.id : id;

    this.diagnosisService.deleteDiagnosis(rawNumberId).subscribe({
      next: () => {
        this.loadDiagnoses();
      },
      error: (err) => {
        console.error("C# Backend Rejection Details:", err);
        this.errorMessage = 'errGeneric';
        this.cdr.detectChanges();
      }
    });
  }
}
