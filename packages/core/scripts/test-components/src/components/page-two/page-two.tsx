import { Component } from '@stencil/core';

@Component({
  tag: 'page-two',
})
export class PageTwo {

  render() {
    return [
      <ion-header>
        <ion-toolbar>
          <ion-title>Page Two</ion-title>
        </ion-toolbar>
      </ion-header>,
      <ion-content>
        this is page two
      </ion-content>
    ];
  }
}
