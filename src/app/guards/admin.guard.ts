import { User } from './../model/user';
import { AuthService } from './../service/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return new Observable((obs) =>{
        this.auth.currentUser.subscribe((user: User) =>{          
          if(user.roles.includes('ADMIN')){
            obs.next(true);
          } else{
            this.router.navigate(['']);
            obs.next(false);
          } 
        });
      });
  }
  
}
