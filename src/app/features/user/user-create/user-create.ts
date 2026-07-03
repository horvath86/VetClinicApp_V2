import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticationService, UserRegisterDTO, UserResponseDTO, UserService } from '../../../core/api/generated';
import { Subscription } from 'rxjs';
import { Role } from '../../../core/enums/clinic-enums';
import { Router } from '@angular/router';
import { TranslationService } from '../../../core/services/translation.service';


@Component({
  selector: 'app-user-create',
  imports: [CommonModule,FormsModule, ReactiveFormsModule],
  templateUrl: './user-create.html',
  styleUrl: './user-create.scss',
})
export class UserCreate implements OnInit, OnDestroy{

  userForm!: FormGroup;

  errorMessage: string |null = null;
  isSaving: boolean = false;

  userList: UserResponseDTO[] = [];

  langSubscription: Subscription | null =null; 

  roleOptions = Object.values(Role).filter(v => typeof v === 'string') as string[];

  constructor(
    private userService: UserService,
    private authService: AuthenticationService, 
    private router: Router,
    public translate: TranslationService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ){}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      phone: ['', [Validators.required, Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
      licenceNumber: [{value: '', disabled: true}, [Validators.minLength(4), Validators.maxLength(4)]],     
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]],
      confirmPassword: ['', [Validators.required]],
      role: [0, [Validators.required]]
    },
    {
      validators: this.passwordMatchValidator
    });

    this.setupRoleConditionalValidation();

    this.loadUsers();

    this.langSubscription = this.translate.LanguageChanged$.subscribe(() => {
      this.cdr.detectChanges();
    });
  }

  private setupRoleConditionalValidation(): void 
  {
    this.userForm.get('role')?.valueChanges.subscribe((selectedRoleValue) => {
      const licenceControl = this.userForm.get('licenceNumber');
      if(!licenceControl) return;

      const isVet = Number(selectedRoleValue)===1;

      if(isVet)
      {
        licenceControl.enable();
        licenceControl.setValidators([
          Validators.required, 
          Validators.minLength(4), 
          Validators.maxLength(4)
        ]);
      }
      else
      {
        licenceControl.setValue('');
        licenceControl.disable();
        licenceControl.setValidators([
          Validators.minLength(4), 
          Validators.maxLength(4)
        ]);
      }
      
      licenceControl.updateValueAndValidity();
      this.cdr.detectChanges();
    });
  }

  passwordMatchValidator(formGroup:FormGroup) : {[key: string]: boolean} | null {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    
    //if both blank
    if (password && confirmPassword && password !== confirmPassword) 
    {
      return { 'passwordMismatch': true };
    }

    return null;
  }

  loadUsers(): void{
    this.userService.getUsers().subscribe({
      next: (response: UserResponseDTO[]) => {
        this.userList = response;
        this.cdr.detectChanges();
      },
      error: () => {
        console.error("Failed to populate active clinic user dropdown.");
      }
    });
  }

  getControl(name:string)
  {
    return this.userForm.get(name);
  }

  saveUser(): void
  {
    if(this.userForm.invalid)
    {
      this.userForm.markAllAsTouched();
      return;
    }

    this.errorMessage = null;
    this.isSaving = true;

    const formvalue = this.userForm.value;

    const payload: UserRegisterDTO = {
      name: formvalue.name,
      phone: formvalue.phone,
      email: formvalue.email,
      licenceNumber: formvalue.licenceNumber,
      password: formvalue.password,
      role: Number(formvalue.role)
    };

    this.authService.register(payload).subscribe({
      next: () => {
        this.isSaving = false;
        this.router.navigate(['/users'])
      },
      error: (err) => {
        console.log("Error callback entered");
        this.isSaving = false;
        console.log("isSaving:", this.isSaving);
        if (err.status === 403) this.errorMessage = 'err403';
        else if (err.status === 0) this.errorMessage = 'err0';
        else if (err.status === 400) this.errorMessage = 'err400';
        else if (err.status === 409) this.errorMessage = 'err409';
        else this.errorMessage = 'errGeneric';
        this.cdr.detectChanges();

      }
    });
  }

  cancel(): void {
    this.router.navigate(['/users']);
  }

  ngOnDestroy(): void {
    if(this.langSubscription)
    {
      this.langSubscription.unsubscribe();
    }
  }


}


