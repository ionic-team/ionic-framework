import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonIcon, IonLabel, IonTabBar, IonTabButton, IonTabs } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { square, triangle } from 'ionicons/icons';

addIcons({ square, triangle });

@Component({
  selector: 'app-tab-bar-scroll-effect',
  template: `
    <ion-tabs>
      <ion-tab-bar slot="bottom" [scrollEffect]="scrollEffect">
        <ion-tab-button tab="tab1" href="/standalone/tab-bar-scroll-effect/tab1">
          <ion-icon name="triangle"></ion-icon>
          <ion-label>Tab 1</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="tab2" href="/standalone/tab-bar-scroll-effect/tab2">
          <ion-icon name="square"></ion-icon>
          <ion-label>Tab 2</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  `,
  standalone: true,
  imports: [IonIcon, IonLabel, IonTabBar, IonTabButton, IonTabs],
})
export class TabBarScrollEffectComponent {
  scrollEffect: 'hide' | 'fade' = this.route.snapshot.queryParamMap.get('effect') === 'fade' ? 'fade' : 'hide';

  constructor(private route: ActivatedRoute) {}
}
