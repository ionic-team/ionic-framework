import { Component, NgModule } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IonicApp, IonicModule, SegmentButton } from '../../../..';


@Component({
  templateUrl: 'main.html'
})
export class E2EPage {
  relationship: string = 'enemies';
  modelStyle: string = 'B';
  appType: string = 'free';
  icons: string = 'camera';
  isDisabled: boolean = true;
  myForm: any;

  constructor(fb: FormBuilder) {
    this.myForm = fb.group({
      mapStyle: ['active', Validators.required]
    });
  }

  toggleDisabled() {
    this.isDisabled = !this.isDisabled;
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

@Component({
  template: '<ion-nav [root]="root"></ion-nav>'
})
export class E2EApp {
  root = E2EPage;
}

@NgModule({
  declarations: [
    E2EApp,
    E2EPage
  ],
  imports: [
    IonicModule.forRoot(E2EApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    E2EApp,
    E2EPage
  ]
})
export class AppModule {}
