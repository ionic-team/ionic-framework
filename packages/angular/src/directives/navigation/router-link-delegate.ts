import { Directive } from '@angular/core';
import {
  RouterLinkDelegateDirective as RouterLinkDelegateBase,
  RouterLinkWithHrefDelegateDirective as RouterLinkHrefDelegateBase,
} from '@ionic/angular/common';

/**
 * Adds support for Ionic routing directions and animations to the base Angular router link directive.
 *
 * When the router link is clicked, the directive will assign the direction and
 * animation so that the routing integration will transition correctly.
 */
@Directive({
  selector: ':not(a):not(area)[routerLink]',
})
export class RouterLinkDelegateDirective extends RouterLinkDelegateBase {}

@Directive({
  selector: 'a[routerLink],area[routerLink]',
})
export class RouterLinkWithHrefDelegateDirective extends RouterLinkHrefDelegateBase {}
