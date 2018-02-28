import { Component } from '@stencil/core';

@Component({
  tag: 'tab-three',
})
export class TabThree {

  render() {
    return [
      <ion-header>
        <ion-toolbar>
          <ion-title>Tab 3</ion-title>
        </ion-toolbar>
      </ion-header>,
      <ion-content>
        tab three
      </ion-content>
    ];
  }
}
