import { Component } from '@angular/core';

@Component({
  selector: 'page-one',
  template: `
<ion-header>
  <ion-toolbar>
    <ion-title>Page One</ion-title>
  </ion-toolbar>
</ion-header>
<ion-content>
  Page One
  <ul>
    <li>ngOnInit - {{ngOnInitDetection}}</li>
  </ul>
</ion-content>
  `
})
export class PageOne {

  ngOnInitDetection = 'initial';

  constructor() {

  }


  ngOnInit() {
    console.log('page one ngOnInit');
    setInterval(() => {
      this.ngOnInitDetection = '' + Date.now();
    }, 500);
  }

}
