import { FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-search-course',
  templateUrl: './search-course.component.html',
  styleUrls: ['./search-course.component.scss']
})
export class SearchCourseComponent implements OnInit {

  constructor(private route: ActivatedRoute,
    private db: AngularFirestore) { }

  searchstring: string;
  searchFormField: FormControl = new FormControl();

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.searchstring = params['searchstring'];
    });
    this.searchFormField.setValue(this.searchstring);

    this.db.collection('courses', ref => ref
    .where('tags', 'array-contains', this.searchstring))
    .valueChanges().subscribe(data =>{
      console.log(data);
      
    }, err =>{
      console.log(err);
      
    })
  }

}
