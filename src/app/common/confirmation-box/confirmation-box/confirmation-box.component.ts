import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmationData } from '../confirmation-data';
import { ConfirmationBoxType } from '../confirmation-type';

@Component({
  selector: 'app-confirmation-box',
  templateUrl: './confirmation-box.component.html',
  styleUrls: ['./confirmation-box.component.scss']
})
export class ConfirmationBoxComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ConfirmationBoxComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationData) { }

  defaultMessage: string = 'Please Confirm';
  type: ConfirmationBoxType;

  public onSubmit = new EventEmitter();
  public onDelete = new EventEmitter();
  public onInfoOk = new EventEmitter();

  ngOnInit() {
    if(this.data !== null, this.data !== undefined){
      if(this.data.message !== null) {
        if(this.data.message.length !== 0){
          this.defaultMessage = this.data.message;          
        }
      }
      if(this.data.type.length !== 0){
        this.type = this.data.type;        
      }
      else{
        this.type = ConfirmationBoxType.SUBMIT;        
      }
    }
  }

  closeDialog(){
    this.dialogRef.close();
  }

  deleteClicked(){    
    this.onDelete.emit();
  }
  submitClicked(){    
    this.onSubmit.emit();
  }
  infoOkClicked(){    
    this.onInfoOk.emit();
  }
}
