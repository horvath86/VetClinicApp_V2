import { Component , ChangeDetectorRef, OnInit, OnDestroy} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService, UserLoginDTO} from '../../../core/api/generated';
import { TranslationService } from '../../../core/services/translation.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})

export class Login implements OnInit , OnDestroy{
  loginCredentials: UserLoginDTO = {
    email: '',
    password: ''
  };

  errorMessage: string | null = null;

  langSubscription: Subscription | null = null;

  constructor(private authService: AuthenticationService, private router: Router, public translate: TranslationService, private cdr: ChangeDetectorRef) 
  {

  }

  onSubmit(): void {
    this.errorMessage = null;
    
    this.authService.login(this.loginCredentials).subscribe({
      next: (response) => {
        sessionStorage.setItem('currentUser', JSON.stringify(response));
        this.router.navigate(['/animals']);
      },
      error: (err) => {
        if(err.status === 401)
        {
          this.errorMessage = "errInvalidCredentials";
        }
        else
        {
          this.errorMessage = "err0";
        }
        this.cdr.detectChanges();
      }
      
    });

  }

  ngOnInit(): void {
    this.langSubscription = this.translate.LanguageChanged$.subscribe(() => {
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    if(this.langSubscription)
    {
      this.langSubscription.unsubscribe();
    }
  }
}

