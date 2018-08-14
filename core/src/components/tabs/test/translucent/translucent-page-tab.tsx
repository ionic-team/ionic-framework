import { Component, Element } from '@stencil/core';

export interface Route {
  path: string | null;
  component: string;
}

@Component({
  tag: 'translucent-page-tab'
})
export class TranslucentPageTab {

  @Element() element!: HTMLElement;

  getTabs() {
    return this.element.closest('ion-tabs')!;
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

  render() {
    return [
      <ion-header translucent>
        <ion-toolbar>
          <ion-title>App Store</ion-title>
        </ion-toolbar>
        <ion-toolbar>
          <ion-searchbar></ion-searchbar>
        </ion-toolbar>
      </ion-header>,
      <ion-content fullscreen={true}>
        <ion-grid>
          <ion-row>
            <ion-col size="6"><f class="red"></f></ion-col>
            <ion-col size="6"><f class="green"></f></ion-col>
            <ion-col size="6"><f class="blue"></f></ion-col>
            <ion-col size="6"><f class="yellow"></f></ion-col>
            <ion-col size="6"><f class="pink"></f></ion-col>
            <ion-col size="6"><f class="purple"></f></ion-col>
            <ion-col size="6"><f class="black"></f></ion-col>
            <ion-col size="6"><f class="orange"></f></ion-col>
          </ion-row>
        </ion-grid>
      </ion-content>
    ];
  }
}
