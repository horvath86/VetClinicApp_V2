import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Medication, MedicationService } from '../../../core/api/generated';
import { Subscription } from 'rxjs';
import { TranslationService } from '../../../core/services/translation.service';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface MedicationVM extends Medication
{
  isExpanded?: boolean;
}

@Component({
  selector: 'app-medication-list',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './medication-list.html',
  styleUrl: './medication-list.scss',
})
export class MedicationList implements OnInit, OnDestroy
{

  medications: MedicationVM[] = [];
  errorMessage: string | null = null;
  langSubscription: Subscription | null = null;
  searchTerm: string = '';

  constructor(
    private medicationService: MedicationService, 
    public translate: TranslationService, 
    private cdr: ChangeDetectorRef
  ){}

  ngOnInit(): void {
    this.loadMedication();

    this.langSubscription = this.translate.LanguageChanged$.subscribe(() => {
      this.cdr.detectChanges();
    });
  }

  loadMedication(): void{
    this.errorMessage = null;

    this.medicationService.getMedications(this.searchTerm || undefined).subscribe({
      next: (data: Medication[]) => {
        this.medications = data.map(med => {
          const clonedMed = JSON.parse(JSON.stringify(med));
          return {
            ...clonedMed,
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

  toggleExpand(med: MedicationVM): void {
    med.isExpanded = !med.isExpanded;
    this.cdr.detectChanges();
  }

  deleteMedication(id: any, event: Event)
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

    this.medicationService.deleteMedication(rawNumberId).subscribe({
      next: () => {
        this.loadMedication();
      },
      error: (err) => {
        console.error("C# Backend Rejection Details:", err);
        this.errorMessage = 'errGeneric';
        this.cdr.detectChanges();
      }
    });
  }
}
