import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import { SocialBottomsheetComponent } from '../social-bottomsheet/social-bottomsheet.component';
@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.scss']
})
export class ContactusComponent implements OnInit {

  ContactForm: FormGroup;

  constructor(private fb: FormBuilder, private _bottomSheet: MatBottomSheet) { 
    this.ContactForm = fb.group({
      "name": [null, Validators.required],
      "form_phone": [null, Validators.compose([Validators.minLength(10),Validators.required, Validators.maxLength(10), Validators.pattern('[7-9]{1}[0-9]{9}')])],
      "form_email":  [null, Validators.compose([Validators.required, Validators.email])],
      "form_message":[null, Validators.required],
    });

   
  }
  openBottomSheet(): void {
    this._bottomSheet.open(SocialBottomsheetComponent);
  }

  ngOnInit(): void {
  }

  get name() {
    return this.ContactForm.get('name');
  }

  get form_phone() {
    return this.ContactForm.get('form_phone');
  }

  get form_email() {
    return this.ContactForm.get('form_email');
  }

  
  get form_message() {
    return this.ContactForm.get('form_message');
  }
}
