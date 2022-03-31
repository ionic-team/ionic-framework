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
  selector: '[routerLink]',
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

  @HostListener('click')
  onClick(): void {
    this.navCtrl.setDirection(this.routerDirection, undefined, undefined, this.routerAnimation);
  }

  private updateTargetUrlAndHref() {
    if (this.routerLink?.urlTree) {
      const href = this.locationStrategy.prepareExternalUrl(this.router.serializeUrl(this.routerLink.urlTree));
      this.elementRef.nativeElement.href = href;
    }
  }
}
