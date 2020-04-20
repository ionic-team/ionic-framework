import { Component, ContentChild, EventEmitter, HostListener, Output, ViewChild } from '@angular/core';

import { NavController } from '../../providers/nav-controller';
import { IonTabBar } from '../proxies';

import { IonRouterOutlet } from './ion-router-outlet';
import { StackEvent } from './stack-utils';

@Component({
  selector: 'ion-tabs',
  template: `
    <ng-content select="[slot=top]"></ng-content>
    <div class="tabs-inner">
      <ion-router-outlet #outlet tabs="true" (stackEvents)="onPageSelected($event)"></ion-router-outlet>
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

  @ViewChild('outlet', { read: IonRouterOutlet, static: false }) outlet: IonRouterOutlet;
  @ContentChild(IonTabBar, { static: false }) tabBar: IonTabBar | undefined;

  @Output() ionTabsWillChange = new EventEmitter<{ tab: string }>();
  @Output() ionTabsDidChange = new EventEmitter<{ tab: string }>();

  constructor(
    private navCtrl: NavController,
  ) { }

  /**
   * @internal
   */
  onPageSelected(detail: StackEvent) {
    const stackId = detail.enteringView.stackId;
    if (detail.tabSwitch && stackId !== undefined) {
      if (this.tabBar) {
        this.tabBar.selectedTab = stackId;
      }
      this.ionTabsWillChange.emit({ tab: stackId });
      this.ionTabsDidChange.emit({ tab: stackId });
    }
  }

  /**
   * When a tab button is clicked, there are several scenarios:
   * 1. If the selected tab is currently active (the tab button has been clicked
   *    again), then it should go to the root view for that tab.
   *
   *   a. Get the saved root view from the router outlet. If the saved root view
   *      matches the tabRootUrl, set the route view to this view including the
   *      navigation extras.
   *   b. If the saved root view from the router outlet does
   *      not match, navigate to the tabRootUrl. No navigation extras are
   *      included.
   *
   * 2. If the current tab tab is not currently selected, get the last route
   *    view from the router outlet.
   *
   *   a. If the last route view exists, navigate to that view including any
   *      navigation extras
   *   b. If the last route view doesn't exist, then navigate
   *      to the default tabRootUrl
   */
  @HostListener('ionTabButtonClick', ['$event.detail.tab'])
  select(tab: string) {
    const alreadySelected = this.outlet.getActiveStackId() === tab;
    const tabRootUrl = `${this.outlet.tabsPrefix}/${tab}`;
    if (alreadySelected) {
      const activeStackId = this.outlet.getActiveStackId();
      const activeView = this.outlet.getLastRouteView(activeStackId);

      // If on root tab, do not navigate to root tab again
      if (activeView.url === tabRootUrl) { return; }

      const rootView = this.outlet.getRootView(tab);
      const navigationExtras = rootView && tabRootUrl === rootView.url && rootView.savedExtras;
      return this.navCtrl.navigateRoot(tabRootUrl, {
        ...(navigationExtras),
        animated: true,
        animationDirection: 'back',
      });
    } else {
      const lastRoute = this.outlet.getLastRouteView(tab);
      /**
       * If there is a lastRoute, goto that, otherwise goto the fallback url of the
       * selected tab
       */
      const url = lastRoute && lastRoute.url || tabRootUrl;
      const navigationExtras = lastRoute && lastRoute.savedExtras;

      return this.navCtrl.navigateRoot(url, {
        ...(navigationExtras),
        animated: true,
        animationDirection: 'back',
      });
    }
  }

  getSelected(): string | undefined {
    return this.outlet.getActiveStackId();
  }
}
