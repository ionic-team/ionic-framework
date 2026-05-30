import { Directive } from '@angular/core';
import {
  RouterLinkDelegateDirective as RouterLinkDelegateBase,
  RouterLinkWithHrefDelegateDirective as RouterLinkHrefDelegateBase,
} from '@ionic/angular/common';

@Directive({
  selector: ':not(a):not(area)[routerLink]',
  standalone: true,
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class IonRouterLink extends RouterLinkDelegateBase {}

@Directive({
  selector: 'a[routerLink],area[routerLink]',
  standalone: true,
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class IonRouterLinkWithHref extends RouterLinkHrefDelegateBase {}
