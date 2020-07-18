import { UserService } from './../../service/user.service';
import { Component, OnInit, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';
import { FireStorageService } from 'src/app/service/fire-storage.service';
import { DomSanitizer } from '@angular/platform-browser';
import { FireService } from 'src/app/service/fire.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'src/app/model/user';

@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.component.html',
  styleUrls: ['./myprofile.component.scss']
})
export class MyprofileComponent implements OnInit {

  filebool: boolean = false;

  constructor(private auth : AuthService,
    private router: Router,
    private storage: FireStorageService,
    private sanitized: DomSanitizer,
    private fire: FireService,
    private snackbar: MatSnackBar,
    private userservice: UserService) { }

  currentUser = this.auth.currentUser;
  ngOnInit(): void {
    let sub = this.currentUser.subscribe(data =>{
      console.log(data.tempProfilePic);
      console.log(data.profilePic);
      
      
      if(data.profilePic != undefined || data.profilePic != null){
        this.storage.getDocument(data.profilePic).subscribe(tata =>{
          data.tempProfilePic = tata;     
          sub.unsubscribe();     
        });
      }
    });
  }

  navigateToCourse(id: string){
    this.router.navigate(['course', id]);
  }
  file: File | any = null;
  imgName : string;
  public imageAdded = new EventEmitter<any>();
  img: any;

  emptyFileContent(){
    this.filebool =false;
    this.file = null;
    this.imgName = null;
  }

  addFile(event: any){
    this.filebool =true;
    this.file = event.target.files[0];    
    this.imgName = this.file.name;
    var reader = new FileReader()
    reader.readAsDataURL(this.file);    
    reader.onload = (event) => {
    }
  }

  uploadProfilePic(){
    this.storage.uploadToStorage(this.file, 'PROFILEPIC').then(object =>{
    let sub = this.currentUser.subscribe(usr =>{
        this.fire.getSingleDocumentById<User>(usr.id, 'users').subscribe(data =>{
          this.snackbar.open('uploaded in storage', 'close', {duration: 1500});
            data.profilePic = object.metadata.fullPath;
            this.fire.updateDocument(data, 'users').subscribe(tata =>{
              sub.unsubscribe();
              this.emptyFileContent();
              this.snackbar.open('User updated Succesfully', 'close', {duration:1500});
              this.auth.publishUser(tata);
            }, err =>{
  
            })
        }, err =>{
  
        })
      })
    }, err =>{

    });
  }

}
