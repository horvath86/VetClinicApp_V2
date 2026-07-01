import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, UserResponseDTO } from '../../../core/api/generated';
import { TranslationService } from '../../../core/services/translation.service';
import { Role } from '../../../core/enums/clinic-enums';
import { Subscription } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-list',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss',
})
export class UserList implements OnInit, OnDestroy {

  users: UserResponseDTO[] = [];
  
  showDeleted: boolean = false;

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


    //manually creating url because selecting inactive users is getting ignored othervise
    const requestObservable = this.userService.getUsers(roleFilter);

    const nativeRequest = (requestObservable as any)._subscribe ? requestObservable : requestObservable;

    if((this.userService as any).configuration)
    {

    }

    const basePath = (this.userService as any).configuration?.basePath || 'https://localhost:7177';
    let targetUrl = `${basePath}/api/User`;

    const queryParams: string[] = [];
    if(roleFilter !== undefined) queryParams.push(`role=${roleFilter}`);
    if(this.showDeleted) queryParams.push(`includeDeleted=true`)

    if(queryParams.length>0)
    {
      targetUrl +=`?${queryParams.join('&')}`;
    }  

    const http = (this.userService as any).httpClient;

    http.get(targetUrl).subscribe({
      next: (data: UserResponseDTO[]) => {
        this.users = data;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        if (err.status === 403) this.errorMessage = 'err403';
        else if (err.status === 0) this.errorMessage = 'err0';
        else this.errorMessage = 'errGeneric';
      }
      
    });

  }

  ngOnDestroy(): void {
    if(this.langSubscription)
    {
      this.langSubscription.unsubscribe();
    }
  }

  toggleDeletedStaff(event: Event): void{
    const input = event.target as HTMLInputElement;
    this.showDeleted = input.checked;
    this.loadUsers();
  }
}
