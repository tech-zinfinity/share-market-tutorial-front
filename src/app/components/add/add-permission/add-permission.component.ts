import { User } from './../../../model/user';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFirestore } from '@angular/fire/firestore';
import { FireService } from './../../../service/fire.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject, EventEmitter, Output } from '@angular/core';

interface PermissionForm{
  permission?:string,
  subscription?:boolean
}

@Component({
  selector: 'app-add-permission',
  templateUrl: './add-permission.component.html',
  styleUrls: ['./add-permission.component.scss']
})
export class AddPermissionComponent implements OnInit {

  @Output() added = new EventEmitter();

  constructor(public dialogRef: MatDialogRef<AddPermissionComponent>,
    private fire: FireService,
    private fb: FormBuilder,
    private db: AngularFirestore,
    private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public userId: string) {       
    }

  permissionForm: FormGroup;

  ngOnInit(): void {
    this.permissionForm = this.fb.group({
      'permission':[null, Validators.required],
      'subscription':[null]
    })
  }

  addPermission(value: PermissionForm){
    this.fire.getSingleDocumentById(this.userId, 'users').subscribe((data:User) =>{
        data.permissions.push(value.permission);
        if(value.subscription){
          data.subscriptions === null || data.subscriptions === undefined ? data.subscriptions = []:null;
          data.subscriptions.push(value.permission);
        }
        let sub = this.fire.updateDocument(data, 'users').subscribe(tata=>{
          
          sub.unsubscribe();
          this.dialogRef.close();
          this.added.emit(true);
          this.snackbar.open('permission added successfully', 'close', {duration: 2000});

        }, err =>{
          this.dialogRef.close();
          this.added.emit(false);
          this.snackbar.open('permission api failed', 'close', {duration: 2000});

        })
    }, err =>{
      this.dialogRef.close();
      this.added.emit(false);
      this.snackbar.open('User account is not available or corrupted', 'close', {duration: 2000});
    });
    
  }

}
