import { Component } from '@stencil/core';

@Component({
  tag: 'page-one',
})
export class PageOne {

  render() {
    return [
      <ion-page>
        <ion-header>
          <ion-toolbar>
            <ion-title>Page One</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content>
          page one
        </ion-content>
      </ion-page>
    ];
  }
}
