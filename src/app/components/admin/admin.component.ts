import { Course } from './../../model/course';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';
import { User } from './../../model/user';
import { FireService } from './../../service/fire.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AddCourseComponent } from './../add/add-course/add-course.component';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { AddPermissionComponent } from '../add/add-permission/add-permission.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  
  //arrayc = ['Course 1', 'Course 2', 'Course 3', 'Course 4'];
  courses: Course[] = [];
  
  usersSource = new BehaviorSubject([{}]);
  usersObs = this.usersSource.asObservable();
  ogUserArray : User[] = [];
  fullUserArray: User[] = [];

  constructor(private dialogRef: MatDialog, 
    private db: AngularFirestore,
    private fire: FireService,
    private snackbar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.db.collection('users').valueChanges().subscribe(users =>{
      this.ogUserArray = users;
      this.fullUserArray = users;
      this.usersSource.next(users);
    });
    this.db.collection('courses').valueChanges().subscribe(data =>{
      console.log(data);
      
      this.courses = data;
    });
  }

  goToCourseDetail(id){
    this.router.navigate(['course',id])
  }

  addCourse(){
    this.dialogRef.open(AddCourseComponent,{
      disableClose: true,
      height:'700px',
      width: '90%'
    });
  }

  logOutAcc(user: User){
    user.loggedIn = false;
    this.fire.updateDocument(user,'users').subscribe(data =>{
      this.snackbar.open('Logged Out Successfully', 'close', {duration:2000});
    });
  }

  deactivateAcc(user: User){
    user.active = false;
    this.fire.updateDocument(user,'users').subscribe(data =>{
      this.snackbar.open('Logged Out Successfully', 'close', {duration:2000});
    });
  }

  applyFilter(event){
    if(event.target.value === ''){
      this.usersSource.next(this.fullUserArray);
    }else{
      this.usersSource.next(this.ogUserArray.filter(data =>data.name.toLowerCase().includes(event.target.value)));
    }
  }

  addPermission(id: string){
    this.dialog.open(AddPermissionComponent, {
      disableClose: true,
      data: id
    })
  }

  deletePermission(id: string, permission: string){
    this.fire.getSingleDocumentById(id, 'users').subscribe((data:User) =>{
      data.permissions.splice(data.permissions.indexOf(permission), 1);
      if(data.subscriptions != null || data.subscriptions != undefined){
        if(data.subscriptions.includes(permission)){
          data.subscriptions.splice(data.subscriptions.indexOf(permission), 1);
        }
      }
      this.fire.updateDocument(data, 'users').subscribe(tata =>{
        this.snackbar.open('permission deleted', 'close', {duration: 2000});
      }, err =>{
          this.snackbar.open('problem in deleting permission', 'close', {duration: 2000});
      });
    }, err =>{
      this.snackbar.open('User is not available or corrupted', 'close', {duration: 2000});
    })
  }
}
