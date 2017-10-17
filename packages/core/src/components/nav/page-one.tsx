import { Component, Element } from '@stencil/core';

@Component({
  tag: 'page-one'
})
export class PageOne {

  @Element() element: HTMLElement;

  ionViewDidEnter() {
    console.log('page one did enter');
  }

  nextPage() {
    const nav = this.element.closest('ion-nav') as any;
    nav.push('page-two');
  }

  protected render() {
    return [<ion-header>
      <ion-navbar>
        <ion-title>Page One</ion-title>
      </ion-navbar>
    </ion-header>,
    <ion-content>
      Page One Content
      <div>
        <ion-button onClick={() => this.nextPage()}>Go to Page Two</ion-button>
      </div>
    </ion-content>
    ];
  }
}
