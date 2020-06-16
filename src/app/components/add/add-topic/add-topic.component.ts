import { MatSnackBar } from '@angular/material/snack-bar';
import { Course } from './../../../model/course';
import { FireService } from './../../../service/fire.service';
import { Topic } from './../../../model/topic';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';

interface topicform{
  title?:string,
  dscp?:string,
  videolink?: videolink[]
}
interface videolink{
  video?:string
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
    private snackbar: MatSnackBar) { 
      //console.log(courseid);
      
    }
  
  ngOnInit(): void {
    this.addTopicForm = this.fb.group({
      'title':[null, Validators.required],
      'dscp':[null, Validators.required],
      'videolink': this.fb.array([])
    })
  }

  addVideoLinkForm(){
    (this.addTopicForm.controls['videolink'] as FormArray).push(this.fb.group({
      'video':[null]
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
      title: value.title,
      dscp: value.dscp,
      videolink:[]
    }
    value.videolink.forEach(data =>{
      topicbody.videolink.push(data.video);
    })
    //console.log(topicbody);
    this.fire.getSingleDocumentById(this.courseid,'courses').subscribe((data:Course) =>{
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
