import { CourseService } from 'src/app/service/course.service';
import { Component, OnInit } from '@angular/core';
import {take} from 'rxjs/operators/';
import { FireStorageService } from './../../service/fire-storage.service';
import { Router } from '@angular/router';
import { AngularFirestore, QueryFn, Query } from '@angular/fire/firestore';
import { Course } from './../../model/course';
import { BehaviorSubject } from 'rxjs';
import { database } from 'firebase';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  courseSource = new BehaviorSubject([{}]);
  courseObs = this.courseSource.asObservable();
  fullCourseArray: Course[] = [];
  ogCourseArray : Course[] = [];
  courses: Course[] = [];

  constructor(private db: AngularFirestore,
    private router: Router,
    public storage: FireStorageService,
    private courseservice: CourseService) { }

    ngOnInit(): void {
      this.courseservice.getActiveCourse().subscribe(courses =>{
        courses.forEach(courses =>{
          if(courses.coverPhotoImg != undefined || courses.coverPhotoImg != null){
            this.storage.getDocument(courses.coverPhotoImg).subscribe(tata =>{
              courses.img = tata;          
            });
          }
          courses.tempTags = '';
          if(courses.tags != undefined || courses.tags != null){
            if(courses.tags.length > 0){
              courses.tags.forEach(t =>{
                courses.tempTags = courses.tempTags.concat(', '+t);
              });              
            }
          }
        });
        this.ogCourseArray = courses;
        this.fullCourseArray = courses;
        this.courseSource.next(courses);
      });
    }

    goToCourseDetail(id){
      this.router.navigate(['course',id])
    }

    applyFilter(event){
      if(event.target.value === ''){
        this.courseSource.next(this.fullCourseArray);
      }else{
        let s = this.ogCourseArray.filter(data =>data.title.toLowerCase().includes(event.target.value) 
        || (data.tempTags.toLowerCase().includes(event.target.value)));        
        this.courseSource.next(s);
      }
    }

}
