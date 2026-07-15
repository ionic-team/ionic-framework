import { __decorate, __param } from "tslib";
import { Directive, HostListener, Input, Optional } from '@angular/core';
/**
 * Adds support for Ionic routing directions and animations to the base Angular router link directive.
 *
 * When the router link is clicked, the directive will assign the direction and
 * animation so that the routing integration will transition correctly.
 */
let RouterLinkDelegateDirective = class RouterLinkDelegateDirective {
    constructor(locationStrategy, navCtrl, elementRef, router, routerLink) {
        this.locationStrategy = locationStrategy;
        this.navCtrl = navCtrl;
        this.elementRef = elementRef;
        this.router = router;
        this.routerLink = routerLink;
        this.routerDirection = 'forward';
        this.onCaptureClick = (ev) => {
            if (this.opensNatively(ev)) {
                ev.stopImmediatePropagation();
            }
        };
    }
    ngOnInit() {
        this.updateTargetUrlAndHref();
        this.updateTabindex();
        /**
         * Ionic components like `ion-item` render a native anchor in their shadow DOM,
         * so a modifier click (ctrl/meta/shift/alt) or a non-`_self` target should let
         * the browser handle the navigation natively (new tab, new window, download)
         * instead of navigating in-app.
         *
         * We listen in the capture phase so this runs before Angular's `RouterLink`
         * handler and our own bubble-phase `onClick`. On a native-navigation intent it
         * stops propagation to cancel the in-app navigation, but leaves `preventDefault`
         * alone so the native anchor can still act.
         */
        this.elementRef.nativeElement.addEventListener('click', this.onCaptureClick, { capture: true });
    }
    ngOnChanges() {
        this.updateTargetUrlAndHref();
    }
    ngOnDestroy() {
        this.elementRef.nativeElement.removeEventListener('click', this.onCaptureClick, { capture: true });
    }
    /**
     * True when the browser should handle the click natively instead of routing
     * in-app: a modifier was held (ctrl/meta/shift/alt), or the host targets
     * something other than `_self`. This mirrors the modifier set Angular's own
     * `RouterLink` guards on, so an Ionic `routerLink` behaves like a plain anchor
     * for new-tab, new-window, and download intents.
     */
    opensNatively(ev) {
        if (ev instanceof MouseEvent && (ev.ctrlKey || ev.metaKey || ev.shiftKey || ev.altKey)) {
            return true;
        }
        const target = this.elementRef.nativeElement.target;
        return target != null && target !== '' && target !== '_self';
    }
    /**
     * The `tabindex` is set to `0` by default on the host element when
     * the `routerLink` directive is used. This causes issues with Ionic
     * components that wrap an `a` or `button` element, such as `ion-item`.
     * See issue https://github.com/angular/angular/issues/28345
     *
     * This method removes the `tabindex` attribute from the host element
     * to allow the Ionic component to manage the focus state correctly.
     */
    updateTabindex() {
        // Ionic components that render a native anchor or button element
        const ionicComponents = [
            'ION-BACK-BUTTON',
            'ION-BREADCRUMB',
            'ION-BUTTON',
            'ION-CARD',
            'ION-FAB-BUTTON',
            'ION-ITEM',
            'ION-ITEM-OPTION',
            'ION-MENU-BUTTON',
            'ION-SEGMENT-BUTTON',
            'ION-TAB-BUTTON',
        ];
        const hostElement = this.elementRef.nativeElement;
        if (ionicComponents.includes(hostElement.tagName)) {
            if (hostElement.getAttribute('tabindex') === '0') {
                hostElement.removeAttribute('tabindex');
            }
        }
    }
    updateTargetUrlAndHref() {
        var _a;
        if ((_a = this.routerLink) === null || _a === void 0 ? void 0 : _a.urlTree) {
            const href = this.locationStrategy.prepareExternalUrl(this.router.serializeUrl(this.routerLink.urlTree));
            this.elementRef.nativeElement.href = href;
        }
    }
    /**
     * @internal
     */
    onClick(ev) {
        this.navCtrl.setDirection(this.routerDirection, undefined, undefined, this.routerAnimation);
        /**
         * This prevents the browser from
         * performing a page reload when pressing
         * an Ionic component with routerLink.
         * The page reload interferes with routing
         * and causes ion-back-button to disappear
         * since the local history is wiped on reload.
         */
        ev.preventDefault();
    }
};
__decorate([
    Input()
], RouterLinkDelegateDirective.prototype, "routerDirection", void 0);
__decorate([
    Input()
], RouterLinkDelegateDirective.prototype, "routerAnimation", void 0);
__decorate([
    HostListener('click', ['$event'])
], RouterLinkDelegateDirective.prototype, "onClick", null);
RouterLinkDelegateDirective = __decorate([
    Directive({
        selector: ':not(a):not(area)[routerLink]',
    }),
    __param(4, Optional())
], RouterLinkDelegateDirective);
export { RouterLinkDelegateDirective };
let RouterLinkWithHrefDelegateDirective = class RouterLinkWithHrefDelegateDirective {
    constructor(locationStrategy, navCtrl, elementRef, router, routerLink) {
        this.locationStrategy = locationStrategy;
        this.navCtrl = navCtrl;
        this.elementRef = elementRef;
        this.router = router;
        this.routerLink = routerLink;
        this.routerDirection = 'forward';
    }
    ngOnInit() {
        this.updateTargetUrlAndHref();
    }
    ngOnChanges() {
        this.updateTargetUrlAndHref();
    }
    updateTargetUrlAndHref() {
        var _a;
        if ((_a = this.routerLink) === null || _a === void 0 ? void 0 : _a.urlTree) {
            const href = this.locationStrategy.prepareExternalUrl(this.router.serializeUrl(this.routerLink.urlTree));
            this.elementRef.nativeElement.href = href;
        }
    }
    /**
     * @internal
     */
    onClick() {
        this.navCtrl.setDirection(this.routerDirection, undefined, undefined, this.routerAnimation);
    }
};
__decorate([
    Input()
], RouterLinkWithHrefDelegateDirective.prototype, "routerDirection", void 0);
__decorate([
    Input()
], RouterLinkWithHrefDelegateDirective.prototype, "routerAnimation", void 0);
__decorate([
    HostListener('click')
], RouterLinkWithHrefDelegateDirective.prototype, "onClick", null);
RouterLinkWithHrefDelegateDirective = __decorate([
    Directive({
        selector: 'a[routerLink],area[routerLink]',
    }),
    __param(4, Optional())
], RouterLinkWithHrefDelegateDirective);
export { RouterLinkWithHrefDelegateDirective };
