import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { MedicalRecordService, MedicalRecordResponseDTO } from '../../../core/api/generated';
import { TranslationService } from '../../../core/services/translation.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-medical-record-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './medical-record-list.html',
  styleUrl: './medical-record-list.scss',
})
export class MedicalRecordList implements OnInit, OnDestroy {
  medicalRecords: MedicalRecordResponseDTO[] = [];
  errorMessage: string | null = null;
  private langSubscription: Subscription | null = null;

  constructor(
    private medicalRecordService: MedicalRecordService,
    public translate: TranslationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadMedicalRecords();

    this.langSubscription = this.translate.LanguageChanged$.subscribe(() => {
      this.cdr.detectChanges();
    });
  }

  loadMedicalRecords(): void {
    this.errorMessage = null;

    this.medicalRecordService.getMedicalRecords().subscribe({
      next: (data: MedicalRecordResponseDTO[]) => {
        this.medicalRecords = data || [];
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

  deleteRecord(id: number, event: Event): void {
    event.stopPropagation();
    
    if (!confirm(this.translate.t.deleteConfirm)) {
      return;
    }

    this.medicalRecordService.deleteMedicalRecord(id).subscribe({
      next: () => {
        this.loadMedicalRecords();
      },
      error: () => {
        this.errorMessage = 'errGeneric';
        this.cdr.detectChanges();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }
}