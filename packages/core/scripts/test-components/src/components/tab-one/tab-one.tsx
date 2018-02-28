import { Component } from '@stencil/core';

@Component({
  tag: 'tab-one',
})
export class TabOne {

  render() {
    return [
      <ion-header>
        <ion-toolbar>
          <ion-title>Page One</ion-title>
        </ion-toolbar>
      </ion-header>,
      <ion-content>
        tab one
      </ion-content>
    ];
  }
}
