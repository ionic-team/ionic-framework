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

  @ViewChild('outlet', { read: IonRouterOutlet }) outlet: IonRouterOutlet;
  @ContentChild(IonTabBar) tabBar: IonTabBar | undefined;

  @Output() ionTabsWillChange = new EventEmitter<{tab: string}>();
  @Output() ionTabsDidChange = new EventEmitter<{tab: string}>();

  constructor(
    private navCtrl: NavController,
  ) {}

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

  @HostListener('ionTabButtonClick', ['$event.detail.tab'])
  select(tab: string) {
    const alreadySelected = this.outlet.getActiveStackId() === tab;
    const href = `${this.outlet.tabsPrefix}/${tab}`;
    const url = alreadySelected
      ? href
      : this.outlet.getLastUrl(tab) || href;

    return this.navCtrl.navigateRoot(url, {
      animated: true,
      animationDirection: 'back'
    });
  }

  getSelected(): string | undefined {
    return this.outlet.getActiveStackId();
  }
}
