import { Component, ContentChild, HostListener, ViewChild } from '@angular/core';
import { TabButtonClickDetail } from '@ionic/core';

import { NavController } from '../../providers';
import { IonTabBar } from '../proxies';

import { IonRouterOutlet } from './ion-router-outlet';
import { RouteView } from './stack-utils';

@Component({
  selector: 'ion-tabs',
  template: `
    <div class="tabs-inner">
      <ion-router-outlet #outlet tabs="true"></ion-router-outlet>
    </div>
    <ng-content></ng-content>`,
  styles: [`
    :host {
      display: flex;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;

      flex-direction: column;

      width: 100%;
      height: 100%;

      contain: layout size style;
      z-index: $z-index-page-container;
    }
    .tabs-inner {
      position: relative;

      flex: 1;

      contain: layout size style;
    }`
  ]
})
export class IonTabs {

  @ViewChild('outlet', { read: IonRouterOutlet }) outlet: IonRouterOutlet;
  @ContentChild(IonTabBar) tabBar: IonTabBar | undefined;

  constructor(
    private navCtrl: NavController,
  ) {}

  @HostListener('ionRouterOutletActivated', ['$event.detail'])
  onPageSelected(detail: {view: RouteView}) {
    if (this.tabBar) {
      this.tabBar.selectedTab = detail.view.stackId;
    }
  }

  @HostListener('ionTabButtonClick', ['$event.detail'])
  onTabButtonClick(detail: TabButtonClickDetail) {
    const { tab, selected } = detail;
    if (tab) {
      const href = `${this.outlet.tabsPrefix}/${tab}`;
      const url = selected
        ? href
        : this.outlet.getLastUrl(tab) || href;

      this.navCtrl.navigateBack(url, true);
    }
  }
}
