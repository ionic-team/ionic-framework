import { Component } from '@angular/core';
import { IonicPage } from '../../../../../..';

@IonicPage({
  name: 'tabs-page-one'
})
@Component({
  template: `
  <ion-header>
    <ion-navbar>
      <ion-title>This is a tab page</ion-title>
      <ion-button menuToggle>
        <ion-icon name="menu"></ion-icon>
      </ion-button>
      <ion-buttons end>
        <ion-button>
          <ion-icon name="funnel"></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-navbar>
  </ion-header>
  <ion-content padding>
    <p>The toolbar should have status bar padding.</p>
  </ion-content>
  `
})
export class TabsPageOne {
}
