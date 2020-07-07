import { MatSnackBar } from '@angular/material/snack-bar';
import { SubscriptionStatus } from './../../constants/constants';
import { FireService } from 'src/app/service/fire.service';
import { Component, OnInit } from '@angular/core';
import { RequestSubcription } from 'src/app/model/request-subcription';
import { auth } from 'firebase';
import { AuthService } from 'src/app/service/auth.service';
import { User } from 'src/app/model/user';


@Component({
  selector: 'app-view-all-subscription-resuest',
  templateUrl: './view-all-subscription-resuest.component.html',
  styleUrls: ['./view-all-subscription-resuest.component.scss']
})
export class ViewAllSubscriptionResuestComponent implements OnInit {

  subs: RequestSubcription[] = [];
  
  RequestedSub: RequestSubcription[] = [];
  PendingSub: RequestSubcription[] = [];
  RejectedSub: RequestSubcription[] = [];
  ApprovedSub: RequestSubcription[] = [];
  currentUser = this.auth.currentUser;

  constructor(private fire: FireService,
    private snackbar: MatSnackBar, private auth : AuthService) { }

  ngOnInit(): void {
    this.fire.getCollection('requestsubscriptions')
    .subscribe((data:RequestSubcription[]) =>{
      this.subs = data;
      console.log(data);
      
      this.RequestedSub = data.filter(tata => tata.status === SubscriptionStatus.REQUESTED);
      this.ApprovedSub = data.filter(tata => tata.status === SubscriptionStatus.APPROVED);
      this.RejectedSub = data.filter(tata => tata.status === SubscriptionStatus.FAILED);
      this.PendingSub = data.filter(tata => tata.status === SubscriptionStatus.PENDING);
    });
  }

  changeStatusOfSubscription(status: string, id: string){
    this.subs.filter(element => element.id === id).forEach(data =>{
      data.status = status;

      this.fire.updateDocument(data, 'requestsubscriptions').subscribe(tata => {
        this.snackbar.open('Rrquest Updated Sussessfully', 'close', {duration: 2000});
        this.ngOnInit();
        let sub = this.currentUser.subscribe(usr_data => {
         this.fire.getSingleDocumentById<User>(usr_data.id, 'users').subscribe(usr_data =>{
          usr_data.myCourses.forEach(cours => {
            if(cours.courseId === data.courseId){
              switch (status) {
                case  SubscriptionStatus.REQUESTED:
                cours.status = SubscriptionStatus.REQUESTED ;
                cours.message = 'Subscription is Requested, waiting for Approval'  

                  break;
                  case  SubscriptionStatus.APPROVED: 
                  cours.status = SubscriptionStatus.APPROVED;
                  cours.message = 'Subscribed';
                  
                  break;
                  case  SubscriptionStatus.FAILED:
                    cours.status = SubscriptionStatus.FAILED;
                    cours.message = 'Payment Failed'
                  
                  break;
                  case  SubscriptionStatus.PENDING:
                    cours.status = SubscriptionStatus.PENDING;
                    cours.message = 'Subscription is Pending'
              
                  break;
              
                default:
                  break;
              }

              this.fire.updateDocument(usr_data, 'users').subscribe(usrr =>{
                this.snackbar.open('User Updated Sussessfully', 'close', {duration: 2000});
                sub.unsubscribe();
                this.auth.publishUser(usrr);
              })

            }
          })
         })
        })

      });
    });
  }



}
