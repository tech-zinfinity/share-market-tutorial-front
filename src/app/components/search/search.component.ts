import { Component, OnInit } from '@angular/core';
import {take} from 'rxjs/operators/';
import { FireStorageService } from './../../service/fire-storage.service';
import { Router } from '@angular/router';
import { AngularFirestore, QueryFn, Query } from '@angular/fire/firestore';
import { Course } from './../../model/course';
import { BehaviorSubject } from 'rxjs';
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
  arrayc = ['Course 1', 'Course 2', 'Course 3', 'Course 4']
  courses: Course[] = [];

  constructor(private db: AngularFirestore,
    private router: Router,
    public storage: FireStorageService) { }

    ngOnInit(): void {
      this.db.collection('courses').valueChanges().subscribe(courses =>{
        this.ogCourseArray = courses;
        this.fullCourseArray = courses;
        this.courseSource.next(courses);
      });

      this.db.collection('courses', ref=>ref.where('active', '==', true)
      .limit(5))
      .valueChanges().pipe(take(5)).subscribe((data: Course[]) =>{
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

    applyFilter(event){
      if(event.target.value === ''){
        this.courseSource.next(this.fullCourseArray);
      }else{
        this.courseSource.next(this.ogCourseArray.filter(data =>data.title.toLowerCase().includes(event.target.value)));
      }
    }

}
