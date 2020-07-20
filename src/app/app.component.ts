import { ShareObjectService } from './service/share-object.service';
import { User } from './model/user';
import { FireService } from './service/fire.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './service/auth.service';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { LoginComponent } from './components/login/login.component';
import { Component, OnDestroy } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy{

  user: User;
  isAdmin: boolean = false;

 ngOnInit() {
  if(localStorage.getItem('shareuser') != null){
    let u : User = JSON.parse(localStorage.getItem('shareuser'));
    this.auth.publishUser(u);
    let sub = this.fire.getSingleDocumentById(u.id,'users').subscribe((d:User) =>{  
      this.user = d;  
      if(d.roles != null || d.roles != undefined){
  
      if(d.roles.includes('ADMIN')){
        this.isAdmin = true;
      }    
    }
      this.auth.publishUser(d);
      sub.unsubscribe();
    });
  }else{
    this.auth.logout();
  }
  this.currentUser.subscribe(usr =>{
    if(usr!=null || usr!= undefined){
      if(usr.roles != null || usr.roles != undefined){
        if(usr.roles.includes('ADMIN')){
          this.isAdmin = true;
        } 
      }
    }
  })
  this.auth.publishAllCourses();
  this.share.publishRequestSubscriptions();
  //this.auth.userChanges();
}

  constructor(private bottomSheet: MatBottomSheet, 
    private dialog: MatDialog,
    public auth: AuthService,
    private router: Router,
    private db: AngularFirestore,
    private fire: FireService,
    private share: ShareObjectService,
    private titleServices: Title,
    private meta: Meta){
      this.titleServices.setTitle('ShareMarketTutorial');
      this.meta.addTag({ name: 'description', content:'Meta tags for Share-Market'});
      this.meta.addTag({name:'keywords', content:' BSE, NSE, Share market basics, indian share market, share market learning, share market in marathi, marathi classes, marathi tutorial, share market basics, Intraday trading, stoploss, order types, equity market,sensex, nifty, nifty future, future and option, option Greeks, technical analysis, candlestick basics, candlestick chart,option trading, currency market, call option, put option, CE, PE, banknifty weekly option, nifty weekly option, option chain, strike rate, stock market, MACD indicator, stochastic indicator, RSI indicator, cross currency trading, swing trading, stock market marathi, indistox'})
  }
  openLoginDialog(){
    this.dialog.open(LoginComponent,{
      disableClose:true
    });
  }
  openSignupDialog(){
    this.dialog.open(SignUpComponent,{
      width:'600px',
      disableClose:true
    });
  }

  arrayc = ['Course 1', 'Course 2', 'Course 3', 'Course 4'];
  

  navigateToHome(){
    this.router.navigate(['']);
  }

  navigateToCourse(){
    this.router.navigate(['/profile'], { fragment: 'mycourse' });
    
  }
  currentUser = this.auth.currentUser;

  logOut(){
    this.auth.publishFalse().subscribe(user =>{
      if(user != null ){
        if(user.loggedIn == false){
          this.fire.getSingleDocumentById(user.id,'users').subscribe((data:User) =>{
            this.isAdmin = false;
            data.loggedIn = false;
            let sub = this.fire.updateDocument(data,'users').subscribe(tata=>{
              
              this.auth.logout();
              sub.unsubscribe();
            })
          })
        }
      }
    });
  }

  ngOnDestroy(){
    this.currentUser.subscribe().unsubscribe();
  }



}
