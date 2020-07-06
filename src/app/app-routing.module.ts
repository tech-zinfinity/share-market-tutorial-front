import { SearchCourseComponent } from './components/search-course/search-course.component';
import { SubscribeCourseComponent } from './components/subscribe-course/subscribe-course.component';
import { ViewCourseComponent } from './components/view-course/view-course.component';
import { AdminComponent } from './components/admin/admin.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AdminGuard } from './guards/admin.guard';
import { FooterComponent } from './components/footer/footer.component';
import { EditorPanelComponent } from './components/blog/editor-panel/editor-panel.component';


const routes: Routes = [
  {path:'', component: HomeComponent},
  {path:'admin',canActivate:[AdminGuard], children:[
    {
      path:'', component: AdminComponent
    },
    {
      path: 'editblog/0', component: EditorPanelComponent
    }
  ]},
  {path:'course/:id', component:ViewCourseComponent},
  {path:'subscription/:id', component:SubscribeCourseComponent},
  {path:'footer',component:FooterComponent},
  {path:'search/:searchstring', component: SearchCourseComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration:"top"})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
