import { Component, Element } from '@stencil/core';

@Component({
  tag: 'app-cordova-page-tabs'
})
export class AppCordovaPageTabs {

  @Element() element: HTMLElement;

  componentDidEnter() {
    console.log('page two did enter');
  }

  render() {
    return [
      <ion-tabs>
        <ion-tab title='Page 1' icon='chatboxes'>
          <ion-nav root='app-cordova-page-one'></ion-nav>
        </ion-tab>

        <ion-tab title='Page 2' icon='map'>
          <ion-nav root='app-cordova-page-two'></ion-nav>
        </ion-tab>

        <ion-tab title='Page 3' icon='person'>
          <ion-nav root='app-cordova-page-three'></ion-nav>
        </ion-tab>
      </ion-tabs>
    ];
  }
}
