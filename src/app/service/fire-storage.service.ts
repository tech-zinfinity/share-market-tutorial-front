import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FireStorageService {
  
  url: any;
  constructor(private afstorage: AngularFireStorage, private share: AuthService) {
    this.currentUser.subscribe(data =>{
      if(data !== null){
        this.user = data.username;
      }
    })
   }
  currentUser = this.share.currentUser;
  user: string;

  public getPic(path: any){
    this.afstorage.ref(path).getDownloadURL().subscribe(url1 => {
      this.url = url1;
      return this.url
    });
  }

  public getPics(path: any) : Observable<string>{
    return this.afstorage.ref(path).getDownloadURL();
  }

  public getDocument(path: string) : Observable<string>{
    return new Observable(obs =>{
      this.afstorage.storage.ref(path).getDownloadURL().then(obj =>{
        obs.next(obj);
      }).catch(err =>{
        obs.error(err);
      });
    });
  }

  
  public uploadToStorage(file: any, type: string) : any{
      let newname  = `img_${this.user +'_'+new Date().getTime()}.jpg`
      return this.afstorage.upload(type+'/'+newname, file);
  }

  public uploadRawFileToStorage(file: any, type: string, extension: string) : any{
    let newname  = `file_${this.user +'_'+new Date().getTime()}.${extension}`
    return this.afstorage.upload(type+'/'+newname, file);
  }

  public deletePic(path: any){
    return this.afstorage.ref(path).delete();
  }

  public getDownloadURL(bucket: string): Promise<string>{
    return this.afstorage.storage.refFromURL('gs://bucket/'
    +bucket).getDownloadURL()
  }
}
