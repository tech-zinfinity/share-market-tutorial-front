import { SubscriptionModel } from './../../model/subscription';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddSubscriptionComponent } from './../add/add-subscription/add-subscription.component';
import { AddTopicComponent } from './../add/add-topic/add-topic.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from './../../service/auth.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Course } from './../../model/course';
import { AngularFirestore } from '@angular/fire/firestore';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import {Location} from '@angular/common';
import { FireService } from 'src/app/service/fire.service';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-view-course',
  templateUrl: './view-course.component.html',
  styleUrls: ['./view-course.component.scss']
})
export class ViewCourseComponent implements OnInit, OnDestroy {

  id: string;
  dummy: Course = {};
  courseSubject = new BehaviorSubject(this.dummy);
  currentCourse = this.courseSubject.asObservable();
  courseSubscrible: boolean = false;
  currentUser = this.auth.currentUser;
  currentUserSubscription : Subscription;

  constructor(private route: ActivatedRoute,
    private _location: Location,
    private db: AngularFirestore,
    private fire: FireService,
    public auth: AuthService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private location: Location,
    private router: Router) { 

  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.fire.getCollectionWithCondition('courses', 'id', '==', this.id).subscribe((data: Course[])=>{
        if(data.length >0){
          this.courseSubject.next(data[0]);
          this.auth.currentUser.subscribe(user =>{
            if(user != null){
              if(user.myCourses != undefined || user.myCourses != null)
              user.myCourses.forEach(co =>{
                if(co.courseId === data[0].id){
                  this.courseSubscrible = true;
                }
              })
            }   
          }); 
          if(!data[0].active){
            this.auth.currentUser.subscribe(data =>{
              if(!data.roles.includes('ADMIN')){
                this.snackbar.open('This course is not available for subscription', 'close', {
                  duration:2000
                })
                this.location.back();
              }
            })
          }
        }else{
          this.backClicked();
        }
      });
    });
  }

  backClicked() {
    this._location.back();
  }

  openAddTopic(){
    let ref = this.dialog.open(AddTopicComponent, {
      disableClose: true,
      height: '600px',
      width: '1000px',
      data: this.id
    });
    
    ref.componentInstance.inserted.subscribe(data =>{
      if(data){
        this.ngOnInit();
      }
    })
  }

  openAddSubscription(){
    let ref = this.dialog.open(AddSubscriptionComponent, {
      disableClose: true,
      height:'300px',
      width:'600px',
      data: this.id
    });

    ref.componentInstance.inserted.subscribe(data =>{
      data === true ? this.ngOnInit() : null;
    });
  }

  publishCourse(bool: boolean){
    this.fire.getSingleDocumentById(this.id,'courses').subscribe((data: Course) =>{
      data.active = bool;
      this.fire.updateDocument(data, 'courses').subscribe(tata =>{
        this.snackbar.open('Course '+this.id+ ' published successfully','close', {duration:2000} );
        this.ngOnInit();
      },
      err =>{
        this.snackbar.open('Error in Publishing Course','close', {duration:2000} );
      });
    }, err=>{
      this.snackbar.open('Error Fetching Course/ Corrupted','close', {duration:2000} );
    });
  }

  navigateToSubscription(){

    this.currentUserSubscription = this.currentUser.subscribe(user =>{
      if(user === null){
        let ref = this.snackbar.open('plaese login or signup to subscribe course','Login /SignUp Now', {duration:5000,
          verticalPosition: 'bottom',
          horizontalPosition: 'end'
        });
        ref.onAction().subscribe(data =>{
          this.dialog.open(LoginComponent, {
            disableClose:true
          })
        })
      }else{
        this.currentCourse.subscribe(data =>{
          let body: NavigationExtras = {
            queryParams:{
              'id': data.id,
              'title': data.title,
              'cost': data.subscription.amount,
              'expiry': data.subscription.expiry
            }
          }
          this.router.navigate(['subscription',this.id]);
    
        });
      }
    })
  }

  ngOnDestroy(){
    if(this.currentUserSubscription != undefined || this.currentUserSubscription!= null)
    this.currentUserSubscription.unsubscribe();
  }
}
