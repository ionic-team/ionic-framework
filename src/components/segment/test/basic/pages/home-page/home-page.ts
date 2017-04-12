import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IonicPage, SegmentButton } from '../../../../../..';

@IonicPage()
@Component({
  templateUrl: 'home-page.html'
})
export class HomePage {
  relationship: string = 'enemies';
  modelStyle: string = 'B';
  appType: string = 'free';
  icons: string = 'camera';
  isDisabledB: boolean = true;
  isDisabledS: boolean = false;

  myForm: any;

  constructor(fb: FormBuilder) {
    this.myForm = fb.group({
      mapStyle: ['active', Validators.required]
    });
  }

  toggleBDisabled() {
    this.isDisabledB = !this.isDisabledB;
  }

  toggleSDisabled() {
    this.isDisabledS = !this.isDisabledS;
  }

  onSegmentChanged(segmentButton: SegmentButton) {
    console.log('Segment changed to', segmentButton.value);
  }

  onSegmentSelected(segmentButton: SegmentButton) {
    console.log('Segment selected', segmentButton.value);
  }

  doSubmit(ev: UIEvent) {
    console.log('Submitting form', this.myForm.value);
    ev.preventDefault();
  }
}
