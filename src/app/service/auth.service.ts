import { Router } from '@angular/router';
import { User } from './../model/user';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) { }
  dummy: User ={};
  userSource = new BehaviorSubject(this.dummy);
  currentUser = this.userSource.asObservable();
  nowUser: User;

  publishUser(user: User){
    user.password = '';
    user.confirmpassword = '';
    this.userSource.next(user);
    localStorage.setItem('shareuser', JSON.stringify(user));    
  }

  logout(){
    this.userSource.next(null);
    localStorage.clear();
    this.router.navigate(['']);
  }

  publishFalse() : Observable<User>{
    return new Observable(obs =>{
      this.nowUser = JSON.parse(localStorage.getItem('shareuser'));
      this.nowUser.loggedIn = false;
      obs.next(this.nowUser);
    });  
  }
}
