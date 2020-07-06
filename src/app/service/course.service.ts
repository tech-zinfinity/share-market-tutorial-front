import { Course } from './../model/course';
import { Document } from './fire.service';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  constructor(private auth: AuthService) { }

  getSingleDocumentById<T extends Document>(id: string, collection: string) : Observable<T>{
    return new Observable(obs =>{
      let sub = this.auth.courseObs.subscribe((data:T[]) =>{
        let arr = data.filter(ref => ref.id === id);
        arr.forEach(tata =>{
          obs.next(tata);
          sub.unsubscribe();
        })
      }, err =>{
        obs.error(err);
        sub.unsubscribe();
      })
    });
  }

  getCollectionWithCondition <T extends Document> (collection:string, match: string, operator: any, matcher: any): Observable<T[]>{
    return new Observable<T[]>(obs =>{
      this.auth.courseObs.subscribe(data =>{

      });
    });
  }

  getActiveCourse(){
    return new Observable(obs =>{
      this.auth.courseObs.subscribe((data: Course[]) =>{
        let arr = data.filter(ref => ref.active === true);
        obs.next(arr);

      }, err =>{
        obs.error(err);
      })
    })
  }
}
