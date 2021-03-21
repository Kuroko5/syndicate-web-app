import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  path: ActivatedRouteSnapshot[];
  route: ActivatedRouteSnapshot;

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.getAuth()) {
      // if not connected return to login page
      if (!localStorage.getItem('currentUserToken')) {
        this.router.navigate(['/'], { queryParams: { returnUrl: state.url } }).catch((error) => {
          return new Error(error);
        });
        return false;
      }
      if (route.data['permission']) {
        // permission on route
        const routePermission = route.data['permission'];
        // get user from local storage
        const user = JSON.parse(localStorage.getItem('user'));
        // get permissions of this users
        const permissions = user.permissions;
        // boolean that will allow (or not) if the user have the permissions to switch on the route
        let unAuthorized: boolean = false;
        // check that users is connected and data in local storage
        if (routePermission && permissions) {
          const found = routePermission.some(x => permissions.indexOf(x) >= 0);
          if (!found)  {
            unAuthorized = true;
          }
        }
        if (unAuthorized) {
          // return to home page
          this.router.navigate(['/home']);
          return true;
        }
        // he got the right to go to the route
        return true;
      }
      return true;
    }

    this.router.navigate(['/']);
    return false;
  }
}
