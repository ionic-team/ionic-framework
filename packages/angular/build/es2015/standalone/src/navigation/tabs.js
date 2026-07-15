import { __decorate } from "tslib";
import { NgIf } from '@angular/common';
import { Component, ContentChild, ContentChildren, ViewChild } from '@angular/core';
import { IonTabs as IonTabsBase } from '@ionic/angular/common';
import { IonTabBar, IonTab } from '../directives/proxies';
import { IonRouterOutlet } from './router-outlet';
let IonTabs = class IonTabs extends IonTabsBase {
};
__decorate([
    ViewChild('outlet', { read: IonRouterOutlet, static: false })
], IonTabs.prototype, "outlet", void 0);
__decorate([
    ContentChild(IonTabBar, { static: false })
], IonTabs.prototype, "tabBar", void 0);
__decorate([
    ContentChildren(IonTabBar)
], IonTabs.prototype, "tabBars", void 0);
__decorate([
    ContentChildren(IonTab)
], IonTabs.prototype, "tabs", void 0);
IonTabs = __decorate([
    Component({
        selector: 'ion-tabs',
        template: `
    <ng-content select="[slot=top]"></ng-content>
    <div class="tabs-inner" #tabsInner>
      <ion-router-outlet
        *ngIf="tabs.length === 0"
        #outlet
        tabs="true"
        (stackWillChange)="onStackWillChange($event)"
        (stackDidChange)="onStackDidChange($event)"
      ></ion-router-outlet>
      <ng-content *ngIf="tabs.length > 0" select="ion-tab"></ng-content>
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
        imports: [IonRouterOutlet, NgIf],
    })
], IonTabs);
export { IonTabs };
