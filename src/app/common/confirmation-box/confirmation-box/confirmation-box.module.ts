import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationBoxComponent } from './confirmation-box.component';
import { ConfirmationBoxService } from '../confirmation-box.service';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    ConfirmationBoxComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDialogModule
  ],
  providers:[
    ConfirmationBoxService
  ],
  entryComponents:[
    ConfirmationBoxComponent
  ]
})
export class ConfirmationBoxModule { }
