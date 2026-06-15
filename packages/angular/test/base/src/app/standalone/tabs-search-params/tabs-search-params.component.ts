import { Component } from '@angular/core';
import { IonIcon, IonLabel, IonTabBar, IonTabButton, IonTabs } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { square, triangle } from 'ionicons/icons';

addIcons({ square, triangle });

@Component({
  selector: 'app-tabs-search-params',
  template: `
    <ion-tabs>
      <ion-tab-bar slot="bottom">
        <ion-tab-button
          tab="tab1"
          href="/standalone/tabs-search-params/tab1?foo=bar"
          data-testid="tab1"
        >
          <ion-icon name="triangle"></ion-icon>
          <ion-label>Tab 1</ion-label>
        </ion-tab-button>
        <ion-tab-button
          tab="tab2"
          href="/standalone/tabs-search-params/tab2?baz=qux"
          data-testid="tab2"
        >
          <ion-icon name="square"></ion-icon>
          <ion-label>Tab 2</ion-label>
        </ion-tab-button>
        <ion-tab-button
          tab="tab3"
          href="/standalone/tabs-search-params/tab3?x=1&y=2#section"
          data-testid="tab3"
        >
          <ion-icon name="triangle"></ion-icon>
          <ion-label>Tab 3</ion-label>
        </ion-tab-button>
        <ion-tab-button
          tab="tab4"
          href="/standalone/tabs-search-params/tab4?q=hello%20world"
          data-testid="tab4"
        >
          <ion-icon name="square"></ion-icon>
          <ion-label>Tab 4</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  `,
  standalone: true,
  imports: [IonIcon, IonLabel, IonTabBar, IonTabButton, IonTabs],
})
export class TabsSearchParamsComponent {}
