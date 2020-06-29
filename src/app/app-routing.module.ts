import { SubscribeCourseComponent } from './components/subscribe-course/subscribe-course.component';
import { ViewCourseComponent } from './components/view-course/view-course.component';
import { AdminComponent } from './components/admin/admin.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AdminGuard } from './guards/admin.guard';
import { FooterComponent } from './components/footer/footer.component';


const routes: Routes = [
  {path:'', component: HomeComponent},
  {path:'admin', component: AdminComponent, canActivate:[AdminGuard]},
  {path:'course/:id', component:ViewCourseComponent},
  {path:'subscription/:id', component:SubscribeCourseComponent},
  {path:'footer',component:FooterComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration:"top"})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
