import { Component } from '@stencil/core';

@Component({
  tag: 'tab-two',
})
export class TabTwo {

  render() {
    return [
      <ion-header>
        <ion-toolbar>
          <ion-title>Tab two (2)</ion-title>
        </ion-toolbar>
      </ion-header>,
      <ion-content>
        <ion-nav></ion-nav>
      </ion-content>
    ];
  }
}
