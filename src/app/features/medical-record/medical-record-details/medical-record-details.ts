import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MedicalRecordResponseDTO, MedicalRecordService } from '../../../core/api/generated';
import { Subscription } from 'rxjs';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-medical-record-details',
  imports: [CommonModule, RouterLink],
  templateUrl: './medical-record-details.html',
  styleUrl: './medical-record-details.scss',
})
export class MedicalRecordDetails implements OnInit, OnDestroy
{
  record: MedicalRecordResponseDTO | null = null;
  errorMessage: string | null = null;
  private langSubscription: Subscription | null = null;

  constructor(
    private medicalRecordService : MedicalRecordService,
    private route: ActivatedRoute,
    public translate: TranslationService,
    private cdr: ChangeDetectorRef
  ){}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if(idParam)
    {
      this.loadRecordDetails(Number(idParam));
    }

    this.langSubscription = this.translate.LanguageChanged$.subscribe(() => {
      this.cdr.detectChanges();
    });
  }

  loadRecordDetails(id: Number): void
  {
    this.errorMessage = null;
    this.medicalRecordService.getMedicalRecordById(id).subscribe({
    next: (data: MedicalRecordResponseDTO) => {
      this.record = data;
      this.cdr.detectChanges();
    },
    error: (err: any) => {
      if (err.status === 404) this.errorMessage = 'err404';
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
}
