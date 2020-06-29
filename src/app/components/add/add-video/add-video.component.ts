import { AuthService } from './../../../service/auth.service';
import { AddvideoIn } from './../../view-course/view-course.component';
import { Course } from './../../../model/course';
import { VideoEntry } from './../../../model/topic';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FireService } from 'src/app/service/fire.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, Inject, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-add-video',
  templateUrl: './add-video.component.html',
  styleUrls: ['./add-video.component.scss']
})
export class AddVideoComponent implements OnInit {

  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddVideoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddvideoIn,
    private fire: FireService,
    private snackbar: MatSnackBar,
    private auth: AuthService) { }

  videoForm : FormGroup;
  @Output() videoAdded = new EventEmitter();

  ngOnInit(): void {
    this.videoForm = this.fb.group({
      'embedLink':[null, Validators.required],
      'active':[true, Validators.required],
      'paid':[true, Validators.required]
    });
  }

  addVideo(vid: VideoEntry){
    this.data.course.topics.forEach(tata =>{
      if(tata.id===this.data.topicId){
        if(tata.videolink === null || tata.videolink === undefined){
          tata.videolink = [];
        }
        tata.videolink.push({
          id: this.auth.generateRandomId(),
          active: vid.active,
          embedLink:vid.embedLink,
          paid: vid.paid,
          video: ''
        });
        this.fire.updateDocument(this.data.course, 'courses').subscribe(nata =>{
          this.dialogRef.close();
          this.videoAdded.emit(true);
          this.snackbar.open('video added successfully', 'close', {duration: 2000});

        });
      }
    })
  }
}
