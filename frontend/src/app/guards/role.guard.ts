import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { RoleService } from '../services/role.service';

export const RoleGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {
  const router: Router = inject(Router);
  const roleService: RoleService = inject(RoleService);

  const isSuperUser = localStorage.getItem('isSuperuser');
  if (isSuperUser === 'true') {
    return true;
  }
  const requiredRoles = route.data['roles'] as Array<string>;
  requiredRoles.push('admin');
  requiredRoles.push('baslyk');
    const hasRole = requiredRoles.some(role => roleService.hasRole(role));

    if (hasRole) {
      return true;
    } else {
      // Navigate to an unauthorized page or show an error message
      return router.createUrlTree(['/unauthorized']);
    }
};
