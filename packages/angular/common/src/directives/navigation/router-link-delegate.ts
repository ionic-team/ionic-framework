import { LocationStrategy } from '@angular/common';
import { ElementRef, OnChanges, OnInit, Directive, HostListener, Input, Optional } from '@angular/core';
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
export class RouterLinkDelegateDirective implements OnInit, OnChanges {
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
  }

  ngOnChanges(): void {
    this.updateTargetUrlAndHref();
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
