import { PaymentRequestStatus, SubscriptionStatus } from './../../constants/constants';
import { CourseService } from './../../service/course.service';
import { AddLearningComponent } from './../add/add-learning/add-learning.component';
import { EditTopicComponent } from './../add/edit-topic/edit-topic.component';
import { EditCourseComponent } from './../add/edit-course/edit-course.component';
import { AddVideoComponent } from './../add/add-video/add-video.component';
import { MyCourse, ShortCourseInfo, User } from './../../model/user';
import { Topic, VideoEntry } from './../../model/topic';
import { AddFileComponent } from './../add/add-file/add-file.component';
import { SubscriptionModel } from './../../model/subscription';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddSubscriptionComponent } from './../add/add-subscription/add-subscription.component';
import { AddTopicComponent } from './../add/add-topic/add-topic.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from './../../service/auth.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Course } from './../../model/course';
import { AngularFirestore } from '@angular/fire/firestore';
import { Component, OnInit, OnDestroy, EventEmitter, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import {Location} from '@angular/common';
import { FireService } from 'src/app/service/fire.service';
import { LoginComponent } from '../login/login.component';
import { FireStorageService } from 'src/app/service/fire-storage.service';
import { DomSanitizer } from '@angular/platform-browser';
import * as firebase from 'firebase/app';
import { AddTagComponent } from '../add/add-tag/add-tag.component';


@Component({
  selector: 'app-view-course',
  templateUrl: './view-course.component.html',
  styleUrls: ['./view-course.component.scss']
})
export class ViewCourseComponent implements OnInit, OnDestroy {

  id: string;
  dummy: Course = {};
  courseSubject = new BehaviorSubject(this.dummy);
  currentCourse = this.courseSubject.asObservable();
  courseSubscrible: boolean = false;
  currentUser = this.auth.currentUser;
  currentUserSubscription : Subscription;
  mycourse: MyCourse;
  isFavorite: boolean = false;
  isSubscribed: boolean = false;

  constructor(private route: ActivatedRoute,
    private _location: Location,
    private db: AngularFirestore,
    private fire: FireService,
    public auth: AuthService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private location: Location,
    private router: Router,
    private storage: FireStorageService,
    private sanitized: DomSanitizer,
    private courseservice: CourseService) { 

  }

  ngOnInit(): void {    
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.fire.getCollectionWithCondition('courses', 'id', '==', this.id).subscribe((data: Course[])=>{
        if(data.length >0){
          data.forEach(kata =>{            
            if(kata.topics != undefined || kata.topics != null)
            kata.topics.forEach(nata =>{
              nata.videolink.forEach(rata =>{
                rata.video = this.sanitized.bypassSecurityTrustHtml(rata.embedLink);
                
              })
            });
            if(kata.tutor != null || kata.tutor != undefined){
              this.db.doc(kata.tutor).valueChanges().subscribe(cata =>{
                kata.temntutor = cata;
                if(kata.temntutor.profilePic != undefined || kata.temntutor.profilePic != null){
                  this.storage.getDocument(kata.temntutor.profilePic).subscribe(tata =>{
                    kata.temntutor.tempProfilePic = tata;          
                  });
                }
              }, err =>{
                console.log(err);
              })
            }
          })
          this.courseSubject.next(data[0]);
          let sub = this.auth.currentUser.subscribe(user =>{
            
            if(user != null){
              if(user.myCourses != undefined || user.myCourses != null){
                user.myCourses.forEach(co =>{
                  if(co.courseId === data[0].id){
                    this.courseSubscrible = true;
                    this.mycourse = co;  
                    console.log(co);
                    if(co.status === SubscriptionStatus.APPROVED.toString()){
                      this.isSubscribed = true;
                    } 

                    //sub.unsubscribe();
                  }
                })
              }
              if(user.favorites != undefined || user.favorites != null){
                user.favorites.forEach(data =>{
                  this.currentCourse.subscribe(course =>{                    
                    if(data.courseId === course.id){
                      this.isFavorite = true;
                    }
                  }) 
                })
              } 
            }   
          }); 
          if(!data[0].active){
            let sub2 = this.auth.currentUser.subscribe(data =>{

              if(!data.roles.includes('ADMIN')){
                this.snackbar.open('This course is not available for subscription', 'close', {
                  duration:2000
                  
                })
                sub2.unsubscribe();
                this.location.back();
              }
            })
          }
        }else{
          this.backClicked();
        }
      });
    });
  }

  backClicked() {
    this._location.back();
  }

  openAddTopic(){
    let ref = this.dialog.open(AddTopicComponent, {
      disableClose: true,
      height: '600px',
      width: '1000px',
      data: this.id
    });
    
    ref.componentInstance.inserted.subscribe(data =>{
      if(data){
        this.ngOnInit();
      }
    })
  }

  fileadded: boolean = false;
  file: File | any = null;
  imgName : string;
  public imageAdded = new EventEmitter<any>();
  img: any;

  emptyFileContent(){
    this.fileadded =false;
    this.file = null;
  }

  addImg(event: any){
    this.fileadded =true;
    this.file = event.target.files[0];    
    this.imgName = this.file.name;
    var reader = new FileReader()
    reader.readAsDataURL(this.file);    
    reader.onload = (event) => {
      // this.img = event.target.result;
      // this.trustedUrl = event.target.result;
    }
  }

  uploadCoverPic(){
    this.storage.uploadToStorage(this.file, 'COVER').then(object =>{
      this.courseservice.getSingleDocumentById<Course>(this.id, 'courses').subscribe(data =>{
        this.snackbar.open('uploaded in storage', 'close', {duration: 1500});
          data.coverPhotoImg = object.metadata.fullPath;
          this.fire.updateDocument(data, 'courses').subscribe(tata =>{
            this.snackbar.open('uploaded in database', 'close', {duration:1500})
            this.courseSubject.next(tata);
          }, err =>{

          })
      }, err =>{

      })
    }, err =>{

    });
  }

  openAddFile(){
    let ref = this.dialog.open(AddFileComponent, {
      disableClose: true,
      height: '600px',
      width: '1000px',
      data: this.id
    });
  }

  openAddSubscription(){
    let ref = this.dialog.open(AddSubscriptionComponent, {
      disableClose: true,
      height:'300px',
      width:'600px',
      data: this.id
    });

    ref.componentInstance.inserted.subscribe(data =>{
      data === true ? this.ngOnInit() : null;
    });
  }

  publishCourse(bool: boolean){
    this.fire.getSingleDocumentById(this.id,'courses').subscribe((data: Course) =>{
      data.active = bool;
      data.publishDate = new Date();
      this.fire.updateDocument(data, 'courses').subscribe(tata =>{
        this.snackbar.open('Course '+this.id+ ' published successfully','close', {duration:2000} );
        this.ngOnInit();
      },
      err =>{
        this.snackbar.open('Error in Publishing Course','close', {duration:2000} );
      });
    }, err=>{
      this.snackbar.open('Error Fetching Course/ Corrupted','close', {duration:2000} );
    });
  }

  navigateToSubscription(){

    this.currentUserSubscription = this.currentUser.subscribe(user =>{
      
      if(user === null){
        let ref = this.snackbar.open('plaese login or signup to subscribe course','Login /SignUp Now', {duration:5000,
          verticalPosition: 'bottom',
          horizontalPosition: 'end'
        });
        ref.onAction().subscribe(data =>{
          this.dialog.open(LoginComponent, {
            disableClose:true
          })
        })
      }else{
        this.currentCourse.subscribe(data =>{
          let body: NavigationExtras = {
            queryParams:{
              'id': data.id,
              'title': data.title,
              'cost': data.subscription.amount,
              'expiry': data.subscription.expiry
            }
          }
          this.router.navigate(['subscription',this.id]);
    
        });
      }
    })
  }

  changeStatusOfTopic(topic: Topic, bool: boolean){
    let sub = this.currentCourse.subscribe(course =>{
      let top = course.topics.filter(top => top.title === topic.title);
      top.forEach(tata =>{
        tata.active = bool;
        this.fire.updateDocument(course, 'courses').subscribe(mata =>{
          this.snackbar.open('topic updated successfully', 'close', {duration:1500});
          sub.unsubscribe();
          this.courseSubject.next(mata);
        })
      })
    })
  } 

  deleteTopic(topic: Topic){
    let sub1 = this.currentCourse.subscribe(course =>{
      course.topics.splice(course.topics.indexOf(topic), 1);
      //console.log(course.topics);
      this.fire.updateDocument(course, 'courses').subscribe(mata =>{
        this.snackbar.open('topic deleted successfully', 'close', {duration:1500});
        sub1.unsubscribe();
        this.courseSubject.next(mata);
      })
    });
    //sub1.unsubscribe();
  }

  changeVideoStatus(vid: VideoEntry, bool: boolean){
    let sub2 = this.currentCourse.subscribe(course =>{
      course.topics.forEach(topic =>{
        let vidd = topic.videolink.filter(tata => tata.id === vid.id);
        vidd.forEach(data =>{
          data.active = bool;
        });
        
        this.fire.updateDocument(course, 'courses').subscribe(mata =>{
          this.snackbar.open('video status updated successfully', 'close', {duration:1500});
          sub2.unsubscribe();
          this.courseSubject.next(mata);
        })
      });

    })
  }

  deleteVideoFromTopic(topic: Topic, video: VideoEntry){
    let sub3  = this.currentCourse.subscribe(course =>{
      let top = course.topics.filter(data => data.title === topic.title);
      top.forEach(tata =>{
        tata.videolink.splice(tata.videolink.indexOf(video), 1);
      });
      this.fire.updateDocument(course, 'courses').subscribe(mata =>{
        this.snackbar.open('video Deleted successfully', 'close', {duration:1500});
        sub3.unsubscribe();
        this.courseSubject.next(mata);
      })
    })
   // sub3.unsubscribe();
  }

  paidUnpaidVideo(vid: VideoEntry, bool: boolean){
    let sub2 = this.currentCourse.subscribe(course =>{
      course.topics.forEach(topic =>{
        let vidd = topic.videolink.filter(tata => tata.id === vid.id);
        vidd.forEach(data =>{
          data.paid = bool;          
        });        
        this.fire.updateDocument(course, 'courses').subscribe(mata =>{
          this.snackbar.open('video status updated successfully', 'close', {duration:1500});
          //this.courseSubject.next(mata);
          sub2.unsubscribe();
        })
      });

    })
  }

  addVideo(topicid: string){
    let sub = this.currentCourse.subscribe(tata =>{

      let ref = this.dialog.open(AddVideoComponent, {
        disableClose: true,
        height: '600px',
        width: '1000px',
        data:{
          course: tata,
          topicId: topicid
        }
      });
      ref.componentInstance.videoAdded.subscribe(data =>{
        sub.unsubscribe();
        this.ngOnInit();
      })
      //sub.unsubscribe();
    });
  }

  ngOnDestroy(){
    if(this.currentUserSubscription != undefined || this.currentUserSubscription!= null)
    this.currentUserSubscription.unsubscribe();
  }

  openEditCourseDialog(){
    let sub = this.currentCourse.subscribe(data =>{
      let ref = this.dialog.open(EditCourseComponent,{
        disableClose: true,
        height:'76%',
        width: '90%',
        data: data
      });
      ref.componentInstance.courseUpdated.subscribe(tata =>{
        sub.unsubscribe();
        this.courseSubject.next(tata);
      })
    });
  }

  openEditTopicDialog(id: string){
    let tata: AddvideoIn = {
    }
    let sub = this.currentCourse.subscribe(data =>{
      tata.course = data;
      tata.topicId = id;
      let ref = this.dialog.open(EditTopicComponent,{
        disableClose: true,
        height:'70%',
        width: '90%',
        data: tata
      });
      ref.componentInstance.courseUpdated.subscribe(tata =>{
        sub.unsubscribe();
        this.courseSubject.next(tata);
      })
    });
  }

  openAddTagDialog(){
    let sub = this.currentCourse.subscribe(data =>{
      let ref = this.dialog.open(AddTagComponent,{
        disableClose: true,
        height:'fit-content',
        width: 'fit-content',
        data: data.id
      });
      ref.componentInstance.added.subscribe(tata =>{
        sub.unsubscribe();
        this.courseSubject.next(tata);
      })
    });
  }

  removeTag(tag: string){
    let sub = this.currentCourse.subscribe(data =>{
      data.tags.splice(data.tags.indexOf(tag), 1);
      this.fire.updateDocument(data, 'courses').subscribe(tata =>{
        sub.unsubscribe();
        this.courseSubject.next(tata);
        this.snackbar.open('tag removed successfully', 'close', {duration: 2000});
      }, err=>{
        this.snackbar.open('Backend is down, connect with Admin', 'close', {duration:2000})
      })
    })
  }

  addToFavorite(){
    let sub1 = this.currentCourse.subscribe(data => {
      let sub2 = this.currentUser.subscribe(user =>{
        let body : ShortCourseInfo = {
          courseDscp: data.dscp,
          courseId: data.id,
          coursePrice: data.subscription.amount,
          courseTitle: data.title
        }
        this.fire.getSingleDocumentById<User>(user.id, 'users').subscribe(tata =>{
          sub2.unsubscribe();
          if(tata.favorites === undefined || tata.favorites === null){
            tata.favorites = []
          }
          tata.favorites.push(body);
          this.fire.updateDocument(tata, 'users').subscribe(nata =>{
            sub1.unsubscribe();
            this.auth.publishUser(nata);
            this.snackbar.open('Course added to favorites', 'close', {duration: 2000});

          },err =>{
            this.snackbar.open('Error in adding course in favorite', 'close', {duration: 2000});

          })
        }, err=>{
          this.snackbar.open('Error in adding course in favorite', 'close', {duration: 2000});

        })
      })
    })
  }

  openAddLearningDialog(){
    let sub = this.currentCourse.subscribe(data =>{
      let ref = this.dialog.open(AddLearningComponent,{
        disableClose: true,
        height:'fit-content',
        width: '500px',
        data: data.id
      });
      ref.componentInstance.added.subscribe(tata =>{
        sub.unsubscribe();
        this.courseSubject.next(tata);
      })
    });
  }

  removeLearning(learning: string){
    let sub = this.currentCourse.subscribe(data =>{
      console.log(data);
      
      data.learnings.splice(data.learnings.indexOf(learning), 1);
      this.fire.updateDocument(data, 'courses').subscribe(tata =>{
        sub.unsubscribe();
        this.courseSubject.next(tata);
        this.snackbar.open('Larning removed successfully', 'close', {duration: 2000});
      }, err=>{
        this.snackbar.open('Backend is down, connect with Admin', 'close', {duration:2000})
      })
    })
  }

  publishTutor(){
    let sub = this.currentCourse.subscribe(course =>{
      let sub2 = this.currentUser.subscribe(user =>{
        // let ref = this.db.collection('users', ref => ref.where('id', '==',user.id));
        let ref2 = this.db.doc('users/'+user.id).ref.path;
        course.tutor = ref2;
        this.db.collection('courses').doc(course.id).update(JSON.parse(
          JSON.stringify(course))).then(obj =>{
          sub.unsubscribe();
          sub2.unsubscribe();
          this.snackbar.open('publihed as user', 'close', {duration:1500});
        }).catch(err =>{
          console.log(err);
          
        })
      })
    })
  }

  removeFromFavorite(){
    let sub2 = this.currentUser.subscribe(data =>{
      let sub = this.currentCourse.subscribe(course=>{
        this.fire.getSingleDocumentById<User>(data.id, 'users').subscribe(user =>{
          user.favorites.filter(nata => nata.courseId === course.id).forEach(d =>{
            user.favorites.splice(user.favorites.indexOf(d[0]), 1);
          })
          this.fire.updateDocument(user, 'users').subscribe(tata =>{
            sub2.unsubscribe();
            sub.unsubscribe();
            this.auth.publishUser(tata);
            this.isFavorite = false;

            this.snackbar.open('Removed from Favorite', 'close', {duration:2000});
          })
        });
      })
    })
  }

}

export interface AddvideoIn{
  course?:Course,
  topicId?:String
}

