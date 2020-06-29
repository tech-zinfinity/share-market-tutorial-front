import { MatSnackBar } from '@angular/material/snack-bar';
import { FireService } from 'src/app/service/fire.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-add-video',
  templateUrl: './add-video.component.html',
  styleUrls: ['./add-video.component.scss']
})
export class AddVideoComponent implements OnInit {

  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddVideoComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private fire: FireService,
    private snackbar: MatSnackBar) { }

  videoForm : FormGroup;

  ngOnInit(): void {
    this.videoForm = this.fb.group({
      'embedLink':[null, Validators.required],
      'active':[true, Validators.required],
      'paid':[true, Validators.required]
    });
  }



}
