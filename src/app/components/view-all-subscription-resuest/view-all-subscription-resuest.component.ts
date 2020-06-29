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

  constructor(private fire: FireService) { }

  ngOnInit(): void {
    this.fire.getCollection('requestsubscriptions')
    .subscribe((data:RequestSubcription[]) =>{
      this.subs = data;
      this.RequestedSub = data.filter(tata => tata.status === SubscriptionStatus.REQUESTED);
      this.ApprovedSub = data.filter(tata => tata.status === SubscriptionStatus.APPROVED);
      this.RejectedSub = data.filter(tata => tata.status === SubscriptionStatus.FAILED);
      this.PendingSub = data.filter(tata => tata.status === SubscriptionStatus.PENDING);
    });
  }

}
