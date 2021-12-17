import { LocationStrategy } from '@angular/common';
import { Directive, ElementRef, HostListener, Input, OnChanges, OnDestroy, OnInit, Optional } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AnimationBuilder, RouterDirection } from '@ionic/core';
import { Subscription } from 'rxjs';

import { NavController } from '../../providers/nav-controller';

@Directive({
  selector: '[routerLink]',
})
export class RouterLinkDelegateDirective implements OnInit, OnChanges, OnDestroy {
  private subscription?: Subscription;

  @Input()
  routerDirection: RouterDirection = 'forward';

  @Input()
  routerAnimation?: AnimationBuilder;

  constructor(
    private elementRef: ElementRef,
    private locationStrategy: LocationStrategy,
    private navCtrl: NavController,
    private router: Router,
    @Optional() private routerLink?: RouterLink
  ) {}

  ngOnInit(): void {
    this.updateTargetUrlAndHref();
  }

  ngOnChanges(): void {
    this.updateTargetUrlAndHref();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private updateTargetUrlAndHref() {
    if (this.routerLink) {
      const href = this.locationStrategy.prepareExternalUrl(this.router.serializeUrl(this.routerLink.urlTree));
      this.elementRef.nativeElement.href = href;
    }
  }

  /**
   * @internal
   */
  @HostListener('click', ['$event'])
  onClick(ev: MouseEvent): void {
    if (!this.elementRef.nativeElement.closest('ion-button')) {
      // In case of CTRL+Click or Meta+Click,
      // ignore those to allow default browser actions.
      if (ev.button === 0 && (ev.ctrlKey || ev.metaKey)) {
        return;
      }
    }

    this.navCtrl.setDirection(this.routerDirection, undefined, undefined, this.routerAnimation);
    ev.preventDefault();
  }
}
