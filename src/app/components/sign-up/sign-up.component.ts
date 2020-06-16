import { AuthService } from './../../service/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from './../../model/user';
import { ConfirmationBoxService } from './../../common/confirmation-box/confirmation-box.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { FireService } from './../../service/fire.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, EventEmitter } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  signUpForm: FormGroup;
  completed = new EventEmitter();
  needLogin = new EventEmitter();

  constructor(private fb: FormBuilder,
    private fire: FireService,
    private db: AngularFirestore,
    private confirm: ConfirmationBoxService,
    public dialogRef: MatDialogRef<SignUpComponent>,
    private snackBar: MatSnackBar,
    private auth: AuthService) {}

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      'username': [null],
      'password':[null, Validators.required],
      'active':[null],
      'permissions':[],
      'loggedIn':[],
      'email':[null, Validators.email],
      'name':[],
      'roles':[],
      'confirmpassword':[null, Validators.required]
    })
  }

  signup(value: User){
    console.log(value);
    this.fire.getCollectionWithCondition('users','email','==',value.email)
    .subscribe((data:User[]) =>{
      console.log(data);
      this.needLogin.emit(true);
      this.snackBar.open('Email alredy registered','close', {duration:2000});
    },err =>{
      console.log(value.password === value.confirmpassword);
      
      if(value.password != value.confirmpassword){
        //this.completed.emit(true);
        this.snackBar.open('Password is not matching to confirmed password','close', {duration:2000});
      }else{
        value.username = value.email;
        value.active = true;
        value.roles = ['USER'];
        value.permissions = ['USER'];
        value.password = btoa(value.password);
        this.fire.saveDocument(value,'users').subscribe(data =>{
          this.dialogRef.close();
          this.snackBar.open('Registration is Successful','close', {duration:2000});
          this.auth.publishUser(data);
          this.dialogRef.close();
          this.completed.emit(true);
        }, err=>{
          this.snackBar.open('There is problem in Registration','close', {duration:2000});
        });
      }
    });
  }

}
