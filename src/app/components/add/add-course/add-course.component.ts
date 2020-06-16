import { AddTopicComponent } from './../add-topic/add-topic.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Course } from './../../../model/course';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { FireService } from 'src/app/service/fire.service';

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.scss']
})
export class AddCourseComponent implements OnInit {

  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddCourseComponent>,
    private fire: FireService,
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog) { }

  addCourseForm: FormGroup;

  ngOnInit(): void {
    this.addCourseForm = this.fb.group({
      'title':[null, Validators.required],
      'dscp':[null, Validators.required],
      'active':[],
      'coverPhotoImg':[]
    });
  }

  desctiption: any;

  onPaste(event){
    this.desctiption = event;
  }

  addCourse(value: Course){
    value.dscp = this.desctiption;
    this.fire.saveDocument(value, 'courses').subscribe(data =>{
      this.dialogRef.close();
      this.router.navigate(['course',data.id]);
    }, err=>{
      this.dialogRef.close();
      this.snackbar.open('problem in creating course, please try after some time', 'close'
      ,{duration: 2000});
    });
    
  }

}
