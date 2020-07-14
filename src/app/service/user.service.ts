import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private db: AngularFirestore) { }

  getUserById(id: string){
    return new Observable(observer =>{
      this.db.collection('users', ref=> ref.where('id', '==', id)).valueChanges().subscribe(data =>{
        observer.next(data);
        observer.complete();
      })
    });
  }
}
