import { FireStorageService } from './../../service/fire-storage.service';
import { Router } from '@angular/router';
import { AngularFirestore, QueryFn, Query } from '@angular/fire/firestore';
import { Course } from './../../model/course';
import { Component, OnInit } from '@angular/core';
import {take} from 'rxjs/operators/';
import { FireService } from 'src/app/service/fire.service';
import { CourseService } from 'src/app/service/course.service';
import { AuthService } from 'src/app/service/auth.service';
import { ShortCourseInfo, User } from 'src/app/model/user';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  arrayc = ['Course 1', 'Course 2', 'Course 3', 'Course 4']
  courses: Course[] = [];
  currentUser = this.auth.currentUser;

  constructor(private db: AngularFirestore,
    private router: Router,
    public storage: FireStorageService,
    private fire: FireService,
    private couserservice: CourseService,
    private auth: AuthService,
    private snackbar: MatSnackBar,
    private courseservice: CourseService) { }

  ngOnInit(): void {
    // this.db.collection('courses', ref=>ref.where('active', '==', true)
    // .limit(5))
    // .valueChanges().pipe(take(5))
    this.courseservice.getActiveCourse()
    .subscribe((data: Course[]) =>{
      data.forEach(courses =>{
        if(courses.coverPhotoImg != undefined || courses.coverPhotoImg != null){
          this.storage.getDocument(courses.coverPhotoImg).subscribe(tata =>{
            courses.img = tata;          
          });
        }
        this.courses = data;
      })
    });


    
  }

  goToCourseDetail(id){
    this.router.navigate(['course',id])
  }

  addToFavorite(id: string){
    this.couserservice.getActiveCourse().subscribe((courses :Course[])=>{
      let arr = courses.filter(ref => ref.id === id);
      arr.forEach(d =>{
        let sub2 = this.currentUser.subscribe(user =>{
          let body : ShortCourseInfo = {
            courseDscp: d.dscp,
            courseId: d.id,
            coursePrice: d.subscription.amount,
            courseTitle: d.title
          }
          this.fire.getSingleDocumentById<User>(user.id, 'users').subscribe(tata =>{
            sub2.unsubscribe();
            if(tata.favorites === undefined || tata.favorites === null){
              tata.favorites = []
            }
            tata.favorites.push(body);
            this.fire.updateDocument(tata, 'users').subscribe(nata =>{
              this.auth.publishUser(nata);
              this.snackbar.open('Course added to favorites', 'close', {duration: 2000});
  
            },err =>{
              this.snackbar.open('Error in adding course in favorite', 'close', {duration: 2000});
  
            })
          }, err=>{
            this.snackbar.open('Error in adding course in favorite', 'close', {duration: 2000});
  
          })
        })
        
      })
    });

    
  }

}
