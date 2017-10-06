import { Component } from '@angular/core';
import { IonicPage, NavParams } from '../../../../../..';

@IonicPage()
@Component({
  template: `
<ion-header>
  <ion-navbar>
    <ion-title>Second Page</ion-title>
  </ion-navbar>
</ion-header>

<ion-content padding>{{msg}}</ion-content>
`
})
export class SecondPage {
  msg: string = '';
  constructor(params: NavParams) {
    this.msg = params.get('msg');
  }
}
