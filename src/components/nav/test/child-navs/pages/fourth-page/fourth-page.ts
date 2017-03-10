import { Component } from '@angular/core';
import { DeepLink } from '../../../../../..';

@DeepLink()
@Component({
  template: `
  <ion-content>
    <ion-list>
      <ion-item *ngFor="let item of items">
        {{item}}
      </ion-item>
    </ion-list>
  </ion-content>
  `
})
export class FourthPage {
  items: string[];

  ionViewWillEnter() {
    let items: string[] = [];
    for ( let i = 0 ; i < 500; i++ ) {
      items.push(`Item ${(i + 1)}`);
    }
    this.items = items;
  }
}
