import { User } from './model/user';
import { FireService } from './service/fire.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './service/auth.service';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { LoginComponent } from './components/login/login.component';
import { Component, OnDestroy } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy{


  constructor(private bottomSheet: MatBottomSheet, 
    private dialog: MatDialog,
    public auth: AuthService,
    private router: Router,
    private db: AngularFirestore,
    private fire: FireService){
      if(localStorage.getItem('shareuser') != null){
        auth.publishUser(JSON.parse(localStorage.getItem('shareuser')));
      }else{
        this.auth.logout();
      }
  }
  openLoginDialog(){
    this.dialog.open(LoginComponent,{
      disableClose:true
    });
  }
  openSignupDialog(){
    this.dialog.open(SignUpComponent,{
      disableClose:true
    });
  }
  title = 'share-market-tutorial';
  arrayc = ['Course 1', 'Course 2', 'Course 3', 'Course 4'];

  navigateToHome(){
    this.router.navigate(['']);
  }
  currentUser = this.auth.currentUser;

  logOut(){
    this.auth.publishFalse().subscribe(user =>{
      if(user != null ){
        if(user.loggedIn == false){
          console.log('in logout',user);
          this.fire.getSingleDocumentById(user.id,'users').subscribe((data:User) =>{
            console.log(data);
            
            data.loggedIn = false;
            this.fire.updateDocument(data,'users').subscribe(tata=>{
              this.auth.logout();
            })
          })
        }
      }
    });
  }

  ngOnDestroy(){
    this.currentUser.subscribe().unsubscribe();
  }
}