import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, UserResponseDTO } from '../../../core/api/generated';
import { TranslationService } from '../../../core/services/translation.service';
import { Role } from '../../../core/enums/clinic-enums';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss',
})
export class UserList implements OnInit, OnDestroy {

  users: UserResponseDTO[] = [];

  errorMessage: string | null = null;

  selectedRole: number | null = null;

  roleOptions = Object.values(Role).filter(r => typeof r === 'string')as string[];

  langSubscription: Subscription | null = null;

  constructor(private userService: UserService, public translate: TranslationService, public cdr: ChangeDetectorRef){}

  ngOnInit(): void {
    this.loadUsers();

    this.langSubscription = this.translate.LanguageChanged$.subscribe(() => {
      this.cdr.detectChanges();
    });
  }

  loadUsers(): void
  {
    this.errorMessage = null;

    const roleFilter = this.selectedRole !== null ? this.selectedRole : undefined;

    this.userService.getUsers(roleFilter as any).subscribe({
      next: (data) => {
        this.users = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        if(err.status === 403)
          {
            this.errorMessage = "err403";
          }
          else if(err.status === 0)
          {
            this.errorMessage = "err0";
          }
          else
          {
            this.errorMessage = "errGeneric";
          }
      }
      
    });

  }

  ngOnDestroy(): void {
    if(this.langSubscription)
    {
      this.langSubscription.unsubscribe();
    }
  }
}
