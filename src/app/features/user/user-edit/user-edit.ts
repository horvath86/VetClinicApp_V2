import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserResponseDTO, UserService, UserUpdateDTO } from '../../../core/api/generated';  
import { Subscription } from 'rxjs';
import { Role } from '../../../core/enums/clinic-enums';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslationService } from '../../../core/services/translation.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-edit',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user-edit.html',
  styleUrl: './user-edit.scss',
})
export class UserEdit implements OnInit, OnDestroy{
   userForm!: FormGroup;

  errorMessage: string |null = null;
  isSaving: boolean = false;

  userId!: number;

  userList: UserResponseDTO[] = [];

  langSubscription: Subscription | null =null; 

  roleOptions = Object.values(Role).filter(v => typeof v === 'string') as string[];

  constructor(
    private userService: UserService,
    private router: Router,
    public translate: TranslationService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute
  ){}

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));

    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      phone: ['', [Validators.required, Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
      licenceNumber: [{value: '', disabled: true}, [Validators.minLength(4), Validators.maxLength(4)]],     
      role: [0, [Validators.required]],
      isActive: [null]
    });

    this.setupRoleConditionalValidation();

    this.loadUserForEditing();

    this.langSubscription = this.translate.LanguageChanged$.subscribe(() => {
      this.cdr.detectChanges();
    });
  }

  private loadUserForEditing(): void{
    this.errorMessage = null;

    const basePath = (this.userService as any).configuration?.basePath || 'https://localhost:7177';
    const targetUrl = `${basePath}/api/User/${this.userId}`;
    const http = (this.userService as any).httpClient;

    http.get(targetUrl).subscribe({
      next: (user: UserResponseDTO) => {
        console.log('User Payload received from API repository:', user);

        this.userForm.patchValue({
          name: user.name,
          phone: user.phone,
          email: user.email,
          role: user.role
        });

         const backendActiveValue = user.isActive ?? (user as any).IsActive;
         this.userForm.get('isActive')?.setValue(backendActiveValue === true || backendActiveValue === 1);

        if (Number(user.role) === 1) {
          this.userForm.get('licenceNumber')?.enable();
          this.userForm.get('licenceNumber')?.patchValue(user.licenceNumber);
        }

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

    const payload: UserUpdateDTO = {
      id: this.userId as any,
      name: formvalue.name,
      phone: formvalue.phone,
      email: formvalue.email,
      licenceNumber: formvalue.licenceNumber,
      role: Number(formvalue.role),
      isActive: formvalue.isActive
    };

    this.userService.updateUser(payload).subscribe({
      next: () => {
        this.isSaving = false;
        this.router.navigate(['/users'])
      },
      error: (err) => {
        this.isSaving = false;
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
