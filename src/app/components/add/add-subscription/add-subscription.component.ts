import { CourseService } from 'src/app/service/course.service';
import { Course } from './../../../model/course';
import { SubscriptionModel } from './../../../model/subscription';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FireService } from './../../../service/fire.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import * as firebase from 'firebase/app';

interface SubscriptionForm{
  amount: number,
  expiry: any
}
@Component({
  selector: 'app-add-subscription',
  templateUrl: './add-subscription.component.html',
  styleUrls: ['./add-subscription.component.scss']
})
export class AddSubscriptionComponent implements OnInit {

  addSubscriptionForm: FormGroup
  @Output() inserted =  new EventEmitter();

  constructor(public dialogRef: MatDialogRef<AddSubscriptionComponent>,
    @Inject(MAT_DIALOG_DATA) public courseid,
    private fire: FireService,
    private snackbar: MatSnackBar,
    private fb: FormBuilder,
    private courseservice: CourseService) { }


  ngOnInit(): void {
    this.addSubscriptionForm = this.fb.group({
      'amount':[null, Validators.pattern('[0-9]*')],
      'expiry':[null, Validators.required]
    });
  }

  addSubscription(value: SubscriptionForm){
    //console.log( firebase.firestore.Timestamp.fromDate(value.expiry.toDate()));
    let subBody:SubscriptionModel = {
      amount: value.amount,
      expiry: value.expiry.toDate()
    }

    this.courseservice.getSingleDocumentById(this.courseid, 'courses').subscribe((data:Course) =>{
        data.subscription = subBody;
        let sub4 = this.fire.updateDocument(data, 'courses').subscribe(tata =>{
          
          this.dialogRef.close();
          this.snackbar.open('Setlled up the Cost', 'close', {duration:2000});
          this.inserted.emit(true);
          sub4.unsubscribe();
        });
    }, err =>{
      this.dialogRef.close();
      this.snackbar.open('Problem with database, connect to developer', 'close', {duration:2000});
      this.inserted.emit(false);
    });
  }

  
}
