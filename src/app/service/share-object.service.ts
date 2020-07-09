import { RequestSubcription } from './../model/request-subcription';
import { BehaviorSubject, Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShareObjectService {

  constructor(private db: AngularFirestore) { }

  dummyReq: RequestSubcription = {}
  requestSubSource = new BehaviorSubject([this.dummyReq]);
  requestSubObs = this.requestSubSource.asObservable();

  publishRequestSubscriptions(){
      this.db.collection('requestsubscriptions', ref => ref.orderBy('updatedOn')).valueChanges().subscribe(data =>{
        this.requestSubSource.next(data);
      })
  }
}
