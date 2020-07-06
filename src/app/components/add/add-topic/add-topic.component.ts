import { CourseService } from './../../../service/course.service';
import { AuthService } from './../../../service/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Course } from './../../../model/course';
import { FireService } from './../../../service/fire.service';
import { Topic } from './../../../model/topic';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import * as firebase from 'firebase/app';
import { now } from 'moment';

interface topicform{
  title?:string,
  dscp?:string,
  videolink?: videolink[],
  active?: boolean,
  createOn?:any
}
interface videolink{
  id?:string
  embedLink?: string,
  paid?: boolean,
  active?: boolean
}

@Component({
  selector: 'app-add-topic',
  templateUrl: './add-topic.component.html',
  styleUrls: ['./add-topic.component.scss']
})
export class AddTopicComponent implements OnInit {

  addTopicForm: FormGroup;
  @Output() inserted  = new EventEmitter()

  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddTopicComponent>,
    @Inject(MAT_DIALOG_DATA) public courseid,
    private fire: FireService,
    private snackbar: MatSnackBar,
    private auth: AuthService,
    private courseservice: CourseService) { 
      //console.log(courseid);
      
    }
  
  ngOnInit(): void {
    this.addTopicForm = this.fb.group({
      'title':[null, Validators.required],
      'dscp':[null],
      'videolink': this.fb.array([]),
      'active':[true, Validators.required]
    })
  }

  addVideoLinkForm(){
    (this.addTopicForm.controls['videolink'] as FormArray).push(this.fb.group({
      'embedLink':[null],
      'active':[true, null],
      'paid':[true, null]
    }));
  }

  getArray(){
    return this.addTopicForm.controls['videolink'];
  }
  
  dscp: string;
  onPaste(value){
    this.dscp = value;
  }

  removeElementFromArray(i){
    (this.addTopicForm.controls['videolink'] as FormArray).removeAt(i);
  }

  addTopic(value: topicform){
    let topicbody: Topic = {
      id: this.auth.generateRandomId(),
      title: value.title,
      dscp: value.dscp,
      videolink:[],
      createOn: firebase.firestore.Timestamp.fromDate(new Date()),
      active: value.active
    }
    value.videolink.forEach(data =>{
      let tata: videolink  = {
        id:this.auth.generateRandomId(),
        active: data.active,
        paid:data.paid,
        embedLink: data.embedLink
      }
      topicbody.videolink.push(tata);
    })

    this.courseservice.getSingleDocumentById(this.courseid,'courses').subscribe((data:Course) =>{
      data.topics === undefined || data.topics === null ? data.topics = [] : data.topics;
      data.topics.push(topicbody);
      this.fire.updateDocument(data,'courses').subscribe(tata =>{
        
        this.dialogRef.close();
        this.snackbar.open('Topic added successfully', 'close', {duration:2000});
        this.inserted.emit(true);
      })
    }, err =>{
      this.snackbar.open('Problem in adding Topic', 'close', {duration:2000});
      this.inserted.emit(false);

    })
  }

}
