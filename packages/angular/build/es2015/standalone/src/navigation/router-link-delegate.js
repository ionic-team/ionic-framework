import { __decorate } from "tslib";
import { Directive } from '@angular/core';
import { RouterLinkDelegateDirective as RouterLinkDelegateBase, RouterLinkWithHrefDelegateDirective as RouterLinkHrefDelegateBase, } from '@ionic/angular/common';
let IonRouterLink = class IonRouterLink extends RouterLinkDelegateBase {
};
IonRouterLink = __decorate([
    Directive({
        selector: ':not(a):not(area)[routerLink]',
        standalone: true,
    })
], IonRouterLink);
export { IonRouterLink };
let IonRouterLinkWithHref = class IonRouterLinkWithHref extends RouterLinkHrefDelegateBase {
};
IonRouterLinkWithHref = __decorate([
    Directive({
        selector: 'a[routerLink],area[routerLink]',
        standalone: true,
    })
], IonRouterLinkWithHref);
export { IonRouterLinkWithHref };
