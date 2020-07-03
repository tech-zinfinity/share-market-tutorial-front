import { FireStorageService } from './../../service/fire-storage.service';
import { Router } from '@angular/router';
import { AngularFirestore, QueryFn, Query } from '@angular/fire/firestore';
import { Course } from './../../model/course';
import { Component, OnInit } from '@angular/core';
import {take} from 'rxjs/operators/';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  arrayc = ['Course 1', 'Course 2', 'Course 3', 'Course 4']
  courses: Course[] = [];

  constructor(private db: AngularFirestore,
    private router: Router,
    public storage: FireStorageService) { }

  ngOnInit(): void {
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

}
