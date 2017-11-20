import { Component, Element } from '@stencil/core';

export interface Route {
  path: string | null;
  component: string;
}

@Component({
  tag: 'page-tab'
})
export class PageTab {

  @Element() element: HTMLElement;

  getTabs() {
    return this.element.closest('ion-tabs') as HTMLIonTabsElement;
  }

  setLayout(value: string) {
    this.getTabs().tabbarLayout = value;
  }

  setPlacement(value: string) {
    this.getTabs().tabbarPlacement = value;
  }

  setHidden(value: boolean) {
    this.getTabs().tabbarHidden = value;
  }

  setHighlight(value: boolean) {
    this.getTabs().tabbarHighlight = value;
  }

  protected render() {
    return [
      <ion-header>
        <ion-toolbar>
          <ion-title>Tab page</ion-title>
        </ion-toolbar>
      </ion-header>,
      <ion-content>
        <p>
          <h2>Set tabbar layout</h2>
          <ion-button onClick={() => this.setLayout('icon-top')}>icon-top</ion-button>
          <ion-button onClick={() => this.setLayout('icon-start')}>icon-start</ion-button>
          <ion-button onClick={() => this.setLayout('icon-end')}>icon-end</ion-button>
          <ion-button onClick={() => this.setLayout('icon-bottom')}>icon-bottom</ion-button>
          <ion-button onClick={() => this.setLayout('icon-hide')}>icon-hide</ion-button>
          <ion-button onClick={() => this.setLayout('title-hide')}>title-hide</ion-button>
        </p>
        <p>
          <h2>Set tabbar placement</h2>
          <ion-button onClick={() => this.setPlacement('top')}>top</ion-button>
          <ion-button onClick={() => this.setPlacement('bottom')}>bottom</ion-button>
        </p>
        <p>
          <h2>Set tabbar hidden</h2>
          <ion-button onClick={() => this.setHidden(true)}>hidden</ion-button>
          <ion-button onClick={() => this.setHidden(false)}>visible</ion-button>
        </p>
        <p>
          <h2>Set tabbar highlight</h2>
          <ion-button onClick={() => this.setHighlight(true)}>enabled</ion-button>
          <ion-button onClick={() => this.setHighlight(false)}>disabled</ion-button>
        </p>
        <p><a href='#/not-found'>Not found</a></p>
        <p><a href='#/'>/</a></p>
        <p><a href='#/tab2'>/tab2</a></p>
        <p><a href='#/tab3'>/tab3</a></p>
        <p><a href='#/tab4'>/tab4</a></p>
        <p><a href='#/tab4/paginaaaa-two'>/tab4/paginaaaa-two</a></p>
        <f></f>
        <f></f>
        <f></f>
        <f></f>
        <f></f>
      </ion-content>
    ];
  }
}
