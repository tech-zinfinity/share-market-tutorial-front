import { AuthService } from './../../../service/auth.service';
import { Course } from './../../../model/course';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FireService } from './../../../service/fire.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { CourseService } from 'src/app/service/course.service';

export interface learnings{
  learning?:string
}
@Component({
  selector: 'app-add-learning',
  templateUrl: './add-learning.component.html',
  styleUrls: ['./add-learning.component.scss']
})
export class AddLearningComponent implements OnInit {

  @Output() added = new EventEmitter();

  constructor(public dialogRef: MatDialogRef<AddLearningComponent>,
    private fire: FireService,
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public courseId: string,
    private auth: AuthService,
    private courseservice: CourseService) {       
    }

  learningForm: FormGroup;
  learnings: string[] = [];
  enableSubmit: boolean = false;

  ngOnInit(): void {
    this.learningForm = this.fb.group({
      'learning':[null, Validators.required],
    });

  }

  addlearning(learning: learnings){ 
    if(learning.learning === '' || learning.learning === null) {
    }else{
      learning.learning.trim();     
      if(learning.learning.length > 0 ){
        this.learnings.push(learning.learning);
        this.enableSubmit = true;
        this.learningForm.controls['learning'].reset(); 
        this.learningForm.controls['learning'].clearValidators();
        this.learningForm.controls['learning'].updateValueAndValidity();
      }
    } 
  }

  removelearning(learning: string){
    this.learnings.splice(this.learnings.indexOf(learning), 1);
    if(this.learnings.length === 0){
      this.enableSubmit = false;
    }
  }

  updateCourse(){
    let sub = this.courseservice.getSingleDocumentById<Course>(this.courseId, 'courses').subscribe(data =>{
      if(data.learnings === undefined || data.learnings ===null){
        data.learnings = []
      }
      this.learnings.forEach(tata =>{
        data.learnings.push(tata);
      });
    
      let sub2 =this.fire.updateDocument(data, 'courses').subscribe(mata =>{
        sub2.unsubscribe();
        this.snackbar.open('learnings added successfully', 'close', {duration:2000});
        sub.unsubscribe();
        this.dialogRef.close();
        this.added.emit(mata);
      })

    })
  }

}
