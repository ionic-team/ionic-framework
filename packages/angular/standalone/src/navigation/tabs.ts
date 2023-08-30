import { Component, ContentChild, ContentChildren, ViewChild, QueryList } from '@angular/core';
import { IonTabs as IonTabsBase } from '@ionic/angular/common';

import { IonTabBar } from '../directives/proxies';

import { IonRouterOutlet } from './router-outlet';

@Component({
  selector: 'ion-tabs',
  template: `
    <ng-content select="[slot=top]"></ng-content>
    <div class="tabs-inner" #tabsInner>
      <ion-router-outlet #outlet tabs="true" (stackEvents)="onPageSelected($event)"></ion-router-outlet>
    </div>
    <ng-content></ng-content>
  `,
  standalone: true,
  styles: [
    `
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
      }
      .tabs-inner {
        position: relative;

        flex: 1;

        contain: layout size style;
      }
    `,
  ],
  imports: [IonRouterOutlet]
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class IonTabs extends IonTabsBase {
  @ViewChild('outlet', { read: IonRouterOutlet, static: false }) outlet: IonRouterOutlet;

  @ContentChild(IonTabBar, { static: false }) tabBar: IonTabBar | undefined;
  @ContentChildren(IonTabBar) tabBars: QueryList<IonTabBar>;
}
