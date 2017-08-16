import { Component, Element } from '@stencil/core';

@Component({
  tag: 'page-three'
})
export class PageThree {

  @Element() element: HTMLElement;

  ionViewDidEnter() {
    console.log('page three did enter');
  }

  pop() {
    const nav = this.element.closest('ion-nav') as any;
    nav.pop();
  }

  render() {
    return [<ion-header>
      <ion-navbar>
        <ion-title>Page Three</ion-title>
      </ion-navbar>
    </ion-header>,
    <ion-content>
      Page Three Content
      <div>
        <ion-button onClick={() => this.pop()}>Go Back</ion-button>
      </div>
    </ion-content>
    ]
  }
}