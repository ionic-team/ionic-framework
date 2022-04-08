import { LocationStrategy } from '@angular/common';
import { ElementRef, OnChanges, OnInit, Directive, HostListener, Input, Optional } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AnimationBuilder, RouterDirection } from '@ionic/core';

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
