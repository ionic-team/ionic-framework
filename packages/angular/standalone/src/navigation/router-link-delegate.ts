import { Component } from '@angular/core';
import {
  RouterLinkDelegateDirective as RouterLinkDelegateBase,
  RouterLinkWithHrefDelegateDirective as RouterLinkHrefDelegateBase,
} from '@ionic/angular/common';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: ':not(a):not(area)[routerLink]',
  template: '<ng-content></ng-content>',
  standalone: true,
})
export class IonRouterLink extends RouterLinkDelegateBase {}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'a[routerLink],area[routerLink]',
  template: '<ng-content></ng-content>',
  standalone: true,
})
export class IonRouterLinkWithHref extends RouterLinkHrefDelegateBase {}
