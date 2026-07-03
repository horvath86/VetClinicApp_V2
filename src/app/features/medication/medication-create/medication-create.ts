import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
  medicationform!: FormGroup;

  errorMessage: string | null = null;
  isSaving: boolean = false;

  langSubscription: Subscription | null = null;

  constructor(private medicationService: MedicationService, private router: Router, public translate: TranslationService, private fb: FormBuilder, private cdr: ChangeDetectorRef){}

  ngOnInit(): void {
    
  }

  ngOnDestroy(): void {
    
  }
}
