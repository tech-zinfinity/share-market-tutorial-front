import { MatSnackBar } from '@angular/material/snack-bar';
import { SubscriptionStatus } from './../../constants/constants';
import { FireService } from 'src/app/service/fire.service';
import { Component, OnInit } from '@angular/core';
import { RequestSubcription } from 'src/app/model/request-subcription';

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

  constructor(private fire: FireService,
    private snackbar: MatSnackBar) { }

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
      });
    });
  }

}
