import { Component } from '@stencil/core';

@Component({
  tag: 'page-one',
})
export class PageOne {

  render() {
    return [
      <ion-header>
        <ion-toolbar>
          <ion-title>Page One</ion-title>
        </ion-toolbar>
      </ion-header>,
      <ion-content>
        page one
        <a href='#/two/second-page'>Ir a la page 2</a>
      </ion-content>
    ];
  }
}
