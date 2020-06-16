import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationBoxComponent } from './confirmation-box/confirmation-box.component';
import { ConfirmationBoxType } from './confirmation-type';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationBoxService {

  constructor(private snackBar: MatSnackBar, public dialog: MatDialog) { }

  open(type: ConfirmationBoxType, message: string) : MatDialogRef<ConfirmationBoxComponent>{
    return this.dialog.open(ConfirmationBoxComponent,{
      width:'400px',
      restoreFocus:false,
      data:{type: type, message: message},
      disableClose:true
    });
  }

}
