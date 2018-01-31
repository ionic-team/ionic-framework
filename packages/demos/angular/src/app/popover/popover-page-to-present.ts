import { Component } from '@angular/core';
//  import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'page-one',
  template: `
    <div style="height: 200px; background-color: blue">
      {{ngOnInitDetection}}
      <ion-button (click)="dismiss()">Close Popover</ion-button>
    </div>
  `
})
export class PopoverPageToPresent {

  ngOnInitDetection = 'initial';

  // constructor(private controller: PopoverController) { }


  ngOnInit() {
    console.log('page one ngOnInit');
    setInterval(() => {
      this.ngOnInitDetection = '' + Date.now();
    }, 500);
  }

  dismiss() {
    // return this.controller.
  }
}
