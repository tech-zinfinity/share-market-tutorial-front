import { FireStorageService } from './../../service/fire-storage.service';
import { Course } from './../../model/course';
import { Router, UrlHandlingStrategy } from '@angular/router';
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
    private dialog: MatDialog,
    private storage: FireStorageService) { }

  ngOnInit(): void {
    this.db.collection('users').valueChanges().subscribe(users =>{
      this.ogUserArray = users;
      this.fullUserArray = users;
      this.usersSource.next(users);
    });
    this.db.collection('courses').valueChanges().subscribe((data:Course[]) =>{
      data.forEach(courses =>{
        if(courses.coverPhotoImg != undefined || courses.coverPhotoImg != null){
          this.storage.getPics(courses.coverPhotoImg).subscribe(tata =>{
            courses.img = tata;
            
          });
        }
        this.courses = data;
      })
      //this.courses = data;
    });
  }

  goToCourseDetail(id){
    this.router.navigate(['course',id])
  }

  addCourse(){
    this.dialogRef.open(AddCourseComponent,{
      disableClose: true,
      height:'76%',
      width: '90%'
    });
  }

  logOutAcc(user: User){
    user.loggedIn = false;
    let sub = this.fire.updateDocument(user,'users').subscribe(data =>{
      
      this.snackbar.open('Logged Out Successfully', 'close', {duration:2000});
      sub.unsubscribe();
    });
  }

  deactivateAcc(user: User){
    user.active = false;
    let sub = this.fire.updateDocument(user,'users').subscribe(data =>{
      
      this.snackbar.open('Logged Out Successfully', 'close', {duration:2000});
      sub.unsubscribe();
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
      width: '500px',
      height:'250px' ,
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
      let sub = this.fire.updateDocument(data, 'users').subscribe(tata =>{        
        this.snackbar.open('permission deleted', 'close', {duration: 2000});
        sub.unsubscribe();
      }, err =>{
          this.snackbar.open('problem in deleting permission', 'close', {duration: 2000});
      });
    }, err =>{
      this.snackbar.open('User is not available or corrupted', 'close', {duration: 2000});
    })
  }

  deleteCourse(document: Course){
    let sub2 = this.fire.deleteDocument(document, 'courses').subscribe(data =>{
      console.log('triggered on delete');
      
      let sub = this.fire.getCollection('users').subscribe((users: User[]) =>{
        console.log(users);
        
        sub.unsubscribe();
        users.forEach(usr =>{
          // sub2.unsubscribe();
          console.log(usr);
          let count = false;

          if(usr.myCourses != null || usr.myCourses != undefined){
            usr.myCourses.forEach(d =>{
              if(d.courseId === document.id){
                usr.myCourses.splice(usr.myCourses.indexOf(d), 1);
                count = true;
              }
            });
          }
          if(usr.favorites != null || usr.favorites != undefined){
            usr.favorites.forEach(c =>{
              if(c.courseId === document.id){
                usr.favorites.splice(usr.favorites.indexOf(c), 1);
                count = true;
              }
            });
          }
          if(count){
            this.fire.updateDocument(usr,'users').subscribe(e =>{
              sub.unsubscribe();
              console.log('coming in true');  
            });
          }
        });
      });
      this.snackbar.open('course '+document.id+' deleted Successfully', 'close', {duration: 2000});
      this.ngOnInit();
    });
  }
}
