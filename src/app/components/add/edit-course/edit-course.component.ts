import { Course } from './../../../model/course';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FireService } from './../../../service/fire.service';
import { AddCourseComponent } from './../add-course/add-course.component';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, Inject, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-edit-course',
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.scss']
})
export class EditCourseComponent implements OnInit {

  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditCourseComponent>,
    private fire: FireService,
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: Course) {
      this.desctiption = data.dscp;
     }

  addCourseForm: FormGroup;
  courseUpdated = new EventEmitter();

  ngOnInit(): void {
    this.addCourseForm = this.fb.group({
      'title':[this.data.title, Validators.required],
      'dscp':[this.data.dscp, Validators.required],
      'active':[this.data.active],
      'coverPhotoImg':[this.data.coverPhotoImg]
    });
  }

  desctiption: any;

  onPaste(event){
    this.desctiption = event;
  }

  addCourse(value: Course){
    this.addCourseForm.controls['dscp'].valueChanges.subscribe(tata =>{
      this.desctiption = tata;
    });
    this.data.dscp = this.desctiption;
    this.data.title = value.title;
    this.fire.updateDocument(this.data, 'courses').subscribe(data =>{
      this.dialogRef.close();
      this.courseUpdated.emit(data);
    }, err=>{
      this.dialogRef.close();
      this.snackbar.open('problem in updating course, please try after some time', 'close'
      ,{duration: 2000});
    });
    
  }

}
