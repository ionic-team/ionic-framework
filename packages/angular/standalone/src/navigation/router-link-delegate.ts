import { LocationStrategy } from '@angular/common';
import { Component, ElementRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  RouterLinkDelegateDirective as RouterLinkDelegateBase,
  RouterLinkWithHrefDelegateDirective as RouterLinkHrefDelegateBase,
  NavController,
} from '@ionic/angular/common';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: ':not(a):not(area)[routerLink]',
  template: '<ng-content></ng-content>',
  standalone: true,
})
export class IonRouterLink extends RouterLinkDelegateBase {
  constructor(
    locationStrategy: LocationStrategy,
    navCtrl: NavController,
    elementRef: ElementRef,
    router: Router,
    routerLink?: RouterLink
  ) {
    super(locationStrategy, navCtrl, elementRef, router, routerLink);
  }
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'a[routerLink],area[routerLink]',
  template: '<ng-content></ng-content>',
  standalone: true,
})
export class IonRouterLinkWithHref extends RouterLinkHrefDelegateBase {
  constructor(
    locationStrategy: LocationStrategy,
    navCtrl: NavController,
    elementRef: ElementRef,
    router: Router,
    routerLink?: RouterLink
  ) {
    super(locationStrategy, navCtrl, elementRef, router, routerLink);
  }
}
