import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService, UserLoginDTO} from '../../../core/api/generated';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})

export class Login {
  loginCredentials: UserLoginDTO = {
    email: '',
    password: ''
  };

  errorMessage: string | null = null;

  constructor(private authService: AuthenticationService, private router: Router) 
  {

  }

  onSubmit(): void {
    console.log("click: ", this.loginCredentials);
    this.errorMessage = null;
    
    this.authService.login(this.loginCredentials).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        sessionStorage.setItem('curentUser', JSON.stringify(response));
        this.router.navigate(['/animals']);
      },
      error: (err) => {
        if(err.status === 401)
        {
          this.errorMessage = "Invalid email address or password";
        }
        else
        {
          this.errorMessage = "A server error occurred. Please try again";
        }
      }
      
    });

  }
}

