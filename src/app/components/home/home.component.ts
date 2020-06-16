import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { Course } from './../../model/course';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  arrayc = ['Course 1', 'Course 2', 'Course 3', 'Course 4']
  courses: Course[] = [];

  constructor(private db: AngularFirestore,
    private router: Router) { }

  ngOnInit(): void {
    
    this.db.collection('courses', ref => ref.where('active','==', true)).valueChanges().subscribe(data =>{
      console.log(data);
      
      this.courses = data;
    });
  }

  goToCourseDetail(id){
    this.router.navigate(['course',id])
  }

}
