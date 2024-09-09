import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth.service";

export const AuthGuard: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {
  
    const router: Router = inject(Router);
    const authService: AuthService = inject(AuthService);
  
    if (authService.isLoggedIn()) {
        return true;
    }
    else {
        return router.navigate(['/login']);    
    }
    // else {
    //   const roles = route.data['permittedRoles'] as Array<string>;
    //   const userRole = authService.getUserToken().role;
  
    //   if (roles && !roles.includes(userRole)) {
    //     return router.navigate(['login']);
    //   }
    //   else
    //     return true;
    // }
  
  }