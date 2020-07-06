import { Course } from './../model/course';
import { Router } from '@angular/router';
import { User } from './../model/user';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router,
    private http: HttpClient,
    private db: AngularFirestore) { }

  dummy: User ={};
  userSource = new BehaviorSubject(this.dummy);
  currentUser = this.userSource.asObservable();
  nowUser: User;

  dummycourse: Course = {}
  courseSoure  = new BehaviorSubject([this.dummycourse]);
  courseObs = this.courseSoure.asObservable();
  
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

  generateRandomId(){
    return JSON.stringify(Math.floor(Math.random() * (999999 - 100000)) + 100000);
  }

  callbackend(){
    let body: {
      "cust_name": "Test Cust Name 5",
      "cust_email": "redkar.darshan11@gmail.com",
      "cust_phone": "9773637141",
      "payable_entity": "EF",
      "amount": 400,
      "order_id_by_entity": "lumsum",
      "currency": "INR",
      "r_order": null
    }
    this.http.post('https://68.183.89.92:8088/pay/generateOrder',body).subscribe(data =>{
      console.log(data);
      
    }, err =>{
      console.log(err);
      
    });
  }

  publishAllCourses(){
    this.db.collection('courses').valueChanges().subscribe(data =>{
      console.log('publishAllCourses()');
      
      this.courseSoure.next(data);
    }, err =>{

    }, () =>{
      console.log('completed');
      
    })
  }
}
