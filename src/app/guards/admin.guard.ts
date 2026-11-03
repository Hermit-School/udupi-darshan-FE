import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  return auth.isAdmin || inject(Router).createUrlTree(['/admin'], state.url ? { queryParams: { access: 'required' } } : undefined);
};
