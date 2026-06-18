import { LocationStrategy } from '@angular/common';
import { ElementRef, OnChanges, OnDestroy, OnInit, Directive, HostListener, Input, Optional } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import type { AnimationBuilder, RouterDirection } from '@ionic/core/components';

import { NavController } from '../../providers/nav-controller';

/**
 * Adds support for Ionic routing directions and animations to the base Angular router link directive.
 *
 * When the router link is clicked, the directive will assign the direction and
 * animation so that the routing integration will transition correctly.
 */
@Directive({
  selector: ':not(a):not(area)[routerLink]',
})
export class RouterLinkDelegateDirective implements OnInit, OnChanges, OnDestroy {
  @Input()
  routerDirection: RouterDirection = 'forward';

  @Input()
  routerAnimation?: AnimationBuilder;

  constructor(
    private locationStrategy: LocationStrategy,
    private navCtrl: NavController,
    private elementRef: ElementRef,
    private router: Router,
    @Optional() private routerLink?: RouterLink
  ) {}

  ngOnInit(): void {
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

  ngOnChanges(): void {
    this.updateTargetUrlAndHref();
  }

  ngOnDestroy(): void {
    this.elementRef.nativeElement.removeEventListener('click', this.onCaptureClick, { capture: true });
  }

  private onCaptureClick = (ev: Event): void => {
    if (this.opensNatively(ev)) {
      ev.stopImmediatePropagation();
    }
  };

  /**
   * True when the browser should handle the click natively instead of routing
   * in-app: a modifier was held (ctrl/meta/shift/alt), or the host targets
   * something other than `_self`. This mirrors the modifier set Angular's own
   * `RouterLink` guards on, so an Ionic `routerLink` behaves like a plain anchor
   * for new-tab, new-window, and download intents.
   */
  private opensNatively(ev: Event): boolean {
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
  private updateTabindex() {
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

  private updateTargetUrlAndHref() {
    if (this.routerLink?.urlTree) {
      const href = this.locationStrategy.prepareExternalUrl(this.router.serializeUrl(this.routerLink.urlTree));
      this.elementRef.nativeElement.href = href;
    }
  }

  /**
   * @internal
   */
  @HostListener('click', ['$event'])
  onClick(ev: UIEvent): void {
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
}

@Directive({
  selector: 'a[routerLink],area[routerLink]',
})
export class RouterLinkWithHrefDelegateDirective implements OnInit, OnChanges {
  @Input()
  routerDirection: RouterDirection = 'forward';

  @Input()
  routerAnimation?: AnimationBuilder;

  constructor(
    private locationStrategy: LocationStrategy,
    private navCtrl: NavController,
    private elementRef: ElementRef,
    private router: Router,
    @Optional() private routerLink?: RouterLink
  ) {}

  ngOnInit(): void {
    this.updateTargetUrlAndHref();
  }

  ngOnChanges(): void {
    this.updateTargetUrlAndHref();
  }

  private updateTargetUrlAndHref() {
    if (this.routerLink?.urlTree) {
      const href = this.locationStrategy.prepareExternalUrl(this.router.serializeUrl(this.routerLink.urlTree));
      this.elementRef.nativeElement.href = href;
    }
  }

  /**
   * @internal
   */
  @HostListener('click')
  onClick(): void {
    this.navCtrl.setDirection(this.routerDirection, undefined, undefined, this.routerAnimation);
  }
}
