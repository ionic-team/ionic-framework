import { Component } from '@angular/core';

@Component({
  template: `
    <ion-content>
      <ion-list>
        <ion-list-header>Ionic</ion-list-header>
        <button ion-item *ngFor="let item of items">Item {{item}}</button>
      </ion-list>
    </ion-content>
  `
})
export class PopoverLongListPage {
  items: number[] = [];

  ngOnInit() {
    for (let i = 1; i < 21; i++) {
      this.items.push(i);
    }
  }
}
