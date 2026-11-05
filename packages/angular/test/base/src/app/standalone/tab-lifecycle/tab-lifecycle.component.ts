import { Component, ViewChild } from '@angular/core';
import {
  IonIcon,
  IonLabel,
  IonTabBar,
  IonTabButton,
  IonTabs,
  ViewDidEnter,
  ViewDidLeave,
  ViewWillEnter,
  ViewWillLeave,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { square, triangle } from 'ionicons/icons';

import { logLifecycle } from './lifecycle-log';

addIcons({ square, triangle });

@Component({
  selector: 'app-tab-lifecycle',
  template: `
    <ion-tabs (ionTabsDidChange)="tabChange()">
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="home">
          <ion-icon name="triangle"></ion-icon>
          <ion-label>Home</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="settings">
          <ion-icon name="square"></ion-icon>
          <ion-label>Settings</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="nested">
          <ion-icon name="triangle"></ion-icon>
          <ion-label>Nested</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  `,
  standalone: true,
  imports: [IonIcon, IonLabel, IonTabBar, IonTabButton, IonTabs],
})
export class TabLifecycleComponent implements ViewWillEnter, ViewDidEnter, ViewWillLeave, ViewDidLeave {
  @ViewChild(IonTabs) tabs!: IonTabs;

  /**
   * The `?propagate` param turns on the workaround from
   * https://github.com/ionic-team/ionic-framework/issues/16834, where the tabs
   * page re-dispatches its lifecycle events onto the active tab.
   */
  private propagate = new URLSearchParams(window.location.search).has('propagate');
  private activeTab?: HTMLElement;

  tabChange() {
    this.activeTab = this.tabs.outlet.activatedView?.element;
  }

  ionViewWillEnter() {
    this.propagateToActiveTab('ionViewWillEnter');
  }

  ionViewDidEnter() {
    this.propagateToActiveTab('ionViewDidEnter');
  }

  ionViewWillLeave() {
    this.propagateToActiveTab('ionViewWillLeave');
  }

  ionViewDidLeave() {
    this.propagateToActiveTab('ionViewDidLeave');
  }

  private propagateToActiveTab(eventName: string) {
    if (this.propagate) {
      this.activeTab?.dispatchEvent(new CustomEvent(eventName));
      logLifecycle(`tabs:${eventName}`);
    }
  }
}
