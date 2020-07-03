import { Course } from './../../../model/course';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FireService } from './../../../service/fire.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';

export interface tags{
  tag?:string
}

@Component({
  selector: 'app-add-tag',
  templateUrl: './add-tag.component.html',
  styleUrls: ['./add-tag.component.scss']
})
export class AddTagComponent implements OnInit {

  @Output() added = new EventEmitter();

  constructor(public dialogRef: MatDialogRef<AddTagComponent>,
    private fire: FireService,
    private fb: FormBuilder,
    private db: AngularFirestore,
    private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public courseId: string) {       
    }

  tagForm: FormGroup;
  tags: string[] = [];
  enableSubmit: boolean = false;

  ngOnInit(): void {
    this.tagForm = this.fb.group({
      'tag':[null, Validators.required],
    });

  }

  addTag(tag: tags){ 
    if(tag.tag === '' || tag.tag === null) {
    }else{
      tag.tag.trim();     
      if(tag.tag.length > 0 ){
        this.tags.push(tag.tag);
        this.enableSubmit = true;
        this.tagForm.controls['tag'].reset(); 
        this.tagForm.controls['tag'].clearValidators();
        this.tagForm.controls['tag'].updateValueAndValidity();
      }
    } 
  }

  removeTag(tag: string){
    this.tags.splice(this.tags.indexOf(tag), 1);
    if(this.tags.length === 0){
      this.enableSubmit = false;
    }
  }

  updateCourse(){
    let sub  = this.fire.getSingleDocumentById<Course>(this.courseId, 'courses').subscribe(data =>{
      if(data.tags === undefined || data.tags ===null){
        data.tags = []
      }
      this.tags.forEach(tata =>{
        data.tags.push(tata);
      });
    
      this.fire.updateDocument(data, 'courses').subscribe(mata =>{
        this.snackbar.open('Tags added successfully', 'close', {duration:2000});
        sub.unsubscribe();
        this.dialogRef.close();
        this.added.emit(mata);
      })

    })
  }

}
