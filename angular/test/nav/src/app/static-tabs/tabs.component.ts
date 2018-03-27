import { Component } from '@angular/core';

@Component({
  selector: 'app-nav-page',
  template: `
    <ion-app>
      <ion-tabs>

        <ion-tab title="Tab 1" icon="star">
          <ion-header>
            <ion-toolbar>
              <ion-title>Tab 1</ion-title>
            </ion-toolbar>
          </ion-header>
          <ion-content padding>
            Tab 1 Static Content
          </ion-content>
        </ion-tab>

        <ion-tab title="Tab 2" icon="heart">
          <ion-header>
            <ion-toolbar>
              <ion-title>Tab 2</ion-title>
            </ion-toolbar>
          </ion-header>
          <ion-content padding>
            Tab 2 Static Content
          </ion-content>
        </ion-tab>

        <ion-tab title="Tab 3" icon="home">
          <ion-header>
            <ion-toolbar>
              <ion-title>Tab 3</ion-title>
            </ion-toolbar>
          </ion-header>
          <ion-content padding>
            Tab 3 Static Content
          </ion-content>
        </ion-tab>

      </ion-tabs>
    </ion-app>
  `
})
export class TabsPageComponent {}
