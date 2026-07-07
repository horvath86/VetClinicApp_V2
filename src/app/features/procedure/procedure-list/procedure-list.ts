import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Procedure, ProcedureService } from '../../../core/api/generated';
import { Subscription } from 'rxjs';
import { TranslationService } from '../../../core/services/translation.service';

interface ProcedureVM extends Procedure
{
  isExpanded?: boolean;
}

@Component({
  selector: 'app-procedure-list',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './procedure-list.html',
  styleUrl: './procedure-list.scss',
})
export class ProcedureList implements OnInit, OnDestroy
{
  procedures: ProcedureVM[] = [];
  errorMessage: string | null = null;
  langSubscription: Subscription | null = null;
  searchTerm: string = '';

  constructor(
    private procedureService: ProcedureService,
    public translate: TranslationService,
    private cdr: ChangeDetectorRef
  ){}

  ngOnInit(): void {
    this.loadProcedures()

    this.langSubscription = this.translate.LanguageChanged$.subscribe(() => {
      this.cdr.detectChanges();
    });
  }


    loadProcedures(): void{
      this.errorMessage = null;
  
      this.procedureService.getProcedures(this.searchTerm || undefined).subscribe({
        next: (data: Procedure[]) => {
          this.procedures = data.map(proc => {
            const clonedProc = JSON.parse(JSON.stringify(proc));
            return {
              ...clonedProc,
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

  toggleExpand(proc: ProcedureVM): void {
    proc.isExpanded = !proc.isExpanded;
    this.cdr.detectChanges();
  }

  deleteProcedure(id: any, event: Event)
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

    this.procedureService.deleteProcedure(rawNumberId).subscribe({
      next: () => {
        this.loadProcedures();
      },
      error: (err) => {
        console.error("C# Backend Rejection Details:", err);
        this.errorMessage = 'errGeneric';
        this.cdr.detectChanges();
      }
    });
  }
}
