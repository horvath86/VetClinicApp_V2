import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);

  const currentUser = sessionStorage.getItem('currentUser');
  
  if(currentUser)
  {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
