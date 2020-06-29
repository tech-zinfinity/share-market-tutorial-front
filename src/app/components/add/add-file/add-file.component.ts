import { MatSnackBar } from '@angular/material/snack-bar';
import { FireService } from 'src/app/service/fire.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-add-file',
  templateUrl: './add-file.component.html',
  styleUrls: ['./add-file.component.scss']
})
export class AddFileComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AddFileComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private fire: FireService,
    private snackbar: MatSnackBar) { }

  ngOnInit(): void {
  }

}
