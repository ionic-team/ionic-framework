import { __decorate } from "tslib";
import { Directive } from '@angular/core';
import { RouterLinkDelegateDirective as RouterLinkDelegateBase, RouterLinkWithHrefDelegateDirective as RouterLinkHrefDelegateBase, } from '@ionic/angular/common';
/**
 * Adds support for Ionic routing directions and animations to the base Angular router link directive.
 *
 * When the router link is clicked, the directive will assign the direction and
 * animation so that the routing integration will transition correctly.
 */
let RouterLinkDelegateDirective = class RouterLinkDelegateDirective extends RouterLinkDelegateBase {
};
RouterLinkDelegateDirective = __decorate([
    Directive({
        standalone: false,
        selector: ':not(a):not(area)[routerLink]',
    })
], RouterLinkDelegateDirective);
export { RouterLinkDelegateDirective };
let RouterLinkWithHrefDelegateDirective = class RouterLinkWithHrefDelegateDirective extends RouterLinkHrefDelegateBase {
};
RouterLinkWithHrefDelegateDirective = __decorate([
    Directive({
        standalone: false,
        selector: 'a[routerLink],area[routerLink]',
    })
], RouterLinkWithHrefDelegateDirective);
export { RouterLinkWithHrefDelegateDirective };
