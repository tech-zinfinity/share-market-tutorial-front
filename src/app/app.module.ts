import { AngularFirestore } from '@angular/fire/firestore';
import { ConfirmationBoxComponent } from './common/confirmation-box/confirmation-box/confirmation-box.component';
import { ConfirmationBoxModule } from './common/confirmation-box/confirmation-box/confirmation-box.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatTooltipModule } from "@angular/material/tooltip";
import { HomeComponent } from './components/home/home.component';
import {MatRippleModule} from '@angular/material/core';
import { CourseDetailComponent } from './components/course-detail/course-detail.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import { LoginComponent } from './components/login/login.component';
import {MatTabsModule} from '@angular/material/tabs';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatDialogModule} from '@angular/material/dialog';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { MatSelectModule } from '@angular/material/select';
import { AngularFireModule, FirebaseFunctions } from '@angular/fire';
import { environment } from "../environments/environment";
import { AngularFireFunctionsModule } from '@angular/fire/functions';
import {MatIconModule} from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatMenuModule} from '@angular/material/menu';
import { AdminComponent } from './components/admin/admin.component';
import { AddCourseComponent } from './components/add/add-course/add-course.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { AddTopicComponent } from './components/add/add-topic/add-topic.component';
import { AddSubscriptionComponent } from './components/add/add-subscription/add-subscription.component';
import { ViewCourseComponent } from './components/view-course/view-course.component';
import { HighLightCardIfTrueDirective } from './directives/high-light-card-if-true.directive';
import { ViewCourseDetailComponent } from './components/view-course-detail/view-course-detail.component';
import {MatListModule} from '@angular/material/list';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { AddPermissionComponent } from './components/add/add-permission/add-permission.component';
import {MatDividerModule} from '@angular/material/divider';
import { SubscribeCourseComponent } from './components/subscribe-course/subscribe-course.component';
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CourseDetailComponent,
    LoginComponent,
    SignUpComponent,
    AdminComponent,
    AddCourseComponent,
    AddTopicComponent,
    AddSubscriptionComponent,
    ViewCourseComponent,
    HighLightCardIfTrueDirective,
    ViewCourseDetailComponent,
    AddPermissionComponent,
    SubscribeCourseComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatTooltipModule,
    MatRippleModule,
    MatFormFieldModule,
    MatBottomSheetModule,
    MatTabsModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatDialogModule,
    MatSelectModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    ConfirmationBoxModule,
    MatIconModule,
    MatSnackBarModule,
    MatMenuModule,
    MatCheckboxModule,
    MatListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMomentDateModule,
    MatDividerModule

  ],
  entryComponents:[
    LoginComponent,
    SignUpComponent,
    ConfirmationBoxComponent,
    AddCourseComponent,
    AddTopicComponent,
    AddSubscriptionComponent,
    AddPermissionComponent
  ],
  providers: [AngularFirestore],
  bootstrap: [AppComponent]
})
export class AppModule { }
