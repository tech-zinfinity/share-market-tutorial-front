import { CourseService } from './../../service/course.service';
import { User } from './../../model/user';
import { PaymentRequestStatus } from './../../constants/constants';
import { RequestSubcription } from './../../model/request-subcription';
import { FormControl, FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Course } from './../../model/course';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from './../../service/auth.service';
import { FireService } from './../../service/fire.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { SubscriptionStatus } from 'src/app/constants/constants';

@Component({
  selector: 'app-subscribe-course',
  templateUrl: './subscribe-course.component.html',
  styleUrls: ['./subscribe-course.component.scss']
})
export class SubscribeCourseComponent implements OnInit, OnDestroy {

  constructor(private route: ActivatedRoute,
    private db: AngularFirestore,
    private fire: FireService,
    public auth: AuthService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private fb: FormBuilder,
    private router: Router,
    private courseservice: CourseService) { }
  
  id: string;
  course: Course = {};
  courseSubject = new BehaviorSubject(this.course);
  courseObs = this.courseSubject.asObservable();
  loggedIn: boolean = false;
  transactioIdControl: FormControl = new FormControl(null, [Validators.required]);
  currentUser = this.auth.currentUser;
  userSubscription: Subscription;
    
  ngOnInit(): void {
    //this.transactioIdControl = this.fb.control([null, Validators.required]);
    
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.courseservice.getSingleDocumentById<Course>(this.id, 'courses').subscribe(data =>{
        this.course = data;
        this.courseSubject.next(data);
        
      });
    });
    this.auth.currentUser.subscribe(data =>{      
      if(data === null){
          this.loggedIn = false;
      }else{
          this.loggedIn = true;
      }
    });
  }

  addRequestForSubscription(value){
    let body: RequestSubcription = {
      courseCost:this.course.subscription.amount,
      courseId: this.course.id,
      courseTitle: this.course.title,
      status: SubscriptionStatus.REQUESTED,
      paymentRef: value
    }
    this.userSubscription = this.currentUser.subscribe(user =>{
      body.userId = user.id;
      body.userEmail = user.email;
      body.username = user.name;      
      this.fire.saveDocument(body, 'requestsubscriptions').subscribe((data:RequestSubcription) =>{
        this.snackbar.open('reuest sent successfully, reuest-id is'+data.id, 'close', {duration: 4000})
        let sub1 = this.fire.getSingleDocumentById(user.id, 'users').subscribe((usr:User)=>{
          this.userSubscription.unsubscribe();          
          if(usr.myCourses === undefined || usr.myCourses === null){
            usr.myCourses = [];
          }
          usr.myCourses.push({
            courseId: this.course.id,
            message: 'Payment is Successfull, Subscription is Requested' ,
            status: PaymentRequestStatus.REQUESTED,
            title:this.course.title
          });
          let sub = this.fire.updateDocument(usr, 'users').subscribe(tata =>{            
            sub1.unsubscribe();
            sub.unsubscribe();            
            this.auth.publishUser(tata);
            this.router.navigate(['course', this.course.id]);
          })
        })
      })

    })
  }

  ngOnDestroy(){

  }
}
