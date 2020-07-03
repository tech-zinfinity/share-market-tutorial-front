import { Topic } from './../../../model/topic';
import { AddvideoIn } from './../../view-course/view-course.component';
import { Course } from './../../../model/course';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FireService } from './../../../service/fire.service';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, Inject, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-edit-topic',
  templateUrl: './edit-topic.component.html',
  styleUrls: ['./edit-topic.component.scss']
})
export class EditTopicComponent implements OnInit {

  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditTopicComponent>,
    private fire: FireService,
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: AddvideoIn) { 
      console.log(this.data);
      
      this.data.course.topics.filter(tata => tata.id === data.topicId).forEach(da =>{
        console.log(da);
        
        this.currentTopic = da;
        console.log(da);
        
        this.dscp = this.currentTopic.dscp;
      })
    }

  editTopicForm: FormGroup
  currentTopic: Topic
  courseUpdated = new EventEmitter()

  dscp: string;
  onPaste(value){
    this.dscp = value;
  }

  ngOnInit(): void {
    this.editTopicForm = this.fb.group({
      'title':[this.currentTopic.title],
      'dscp':[this.currentTopic.dscp]
    });
  }

  updateTopic(value: Topic){
    this.editTopicForm.controls['dscp'].valueChanges.subscribe(tata =>{
      this.dscp = tata;
    });
    this.currentTopic.title = value.title;
    this.currentTopic.dscp = this.dscp;

    this.data.course.topics.filter(tata => tata.id === this.currentTopic.id)
    .forEach(da =>{
      da.title = value.title,
      da.dscp = this.dscp;
    });

    this.fire.updateDocument(this.data.course, 'courses').subscribe(data =>{
      this.dialogRef.close();
      this.courseUpdated.emit(data);
    }, err=>{
      this.dialogRef.close();
      this.snackbar.open('problem in updating course, please try after some time', 'close'
      ,{duration: 2000});
    });

  }

}

