import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'second-page',
  template: `
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Second Page</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content padding>
      Secnd Page Content
    </ion-content>
  </ion-page>
  `
})
export class SecondPageComponent implements OnInit {

  constructor() { }

  ngOnInit() { }

}
