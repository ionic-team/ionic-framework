import { Component, Element } from '@stencil/core';

@Component({
  tag: 'page-two'
})
export class PageTwo {

  @Element() element: HTMLElement;

  ionViewDidEnter() {
    console.log('page two did enter');
  }

  nextPage() {
    const nav = this.element.closest('ion-nav') as any;
    nav.push('page-three');
  }

  pop() {
    const nav = this.element.closest('ion-nav') as any;
    nav.pop();
  }

  protected render() {
    return [<ion-header>
      <ion-toolbar>
        <ion-title>Page Two</ion-title>
      </ion-toolbar>
    </ion-header>,
    <ion-content fullscreen={true}>
      Page Two Content
      <div>
        <ion-button onClick={() => this.nextPage()}>Go to Page Three</ion-button>
      </div>
      <div>
        <ion-button onClick={() => this.pop()}>Go Back</ion-button>
      </div>
    </ion-content>
    ];
  }
}
