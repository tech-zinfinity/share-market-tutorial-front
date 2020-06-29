import { SignUpComponent } from './../sign-up/sign-up.component';
import { AuthService } from './../../service/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FireService } from './../../service/fire.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from './../../model/user';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface LoginUser{
  username?:string,
  password?:string
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<LoginComponent>,
    private db: AngularFirestore,
    private fire: FireService,
    private snackBar: MatSnackBar,
    private auth: AuthService,
    private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      'username': [null, Validators.required],
      'password':[null, Validators.required]
    })
  }

  login(value: LoginUser){    
    this.fire.getCollectionWithCondition('users','email','==',value.username).subscribe((data:User[]) =>{
      if(data.length > 0){
        data.forEach(tata =>{
          // console.log(atob('ZGFyc2hhbg=='));
          // console.log('tata----',tata);
          
          if(tata.password === btoa(value.password)){
            if(tata.loggedIn === true){
              this.snackBar.open('You are already logged in, if not please connect Admin','close', {duration:2000});
            }else{
              tata.loggedIn = true;
              let sub  = this.fire.updateDocument(tata,'users').subscribe(dat =>{
                
                this.auth.publishUser(dat);
                this.snackBar.open('Login Successful','close', {duration:2000});
                sub.unsubscribe();
                this.dialogRef.close();
              });
            }
          }else{
            this.snackBar.open('Login Credentials are wrong, please check ','close', {duration:2000});
          }
        })
      }
    },err=>{
      this.snackBar.open('Login Credentials are wrong !, please check ','close', {duration:2000});
    })
  }

  signup(){
    this.dialogRef.close();
    this.dialog.open(SignUpComponent, {
      disableClose: true
    })
  }
}
