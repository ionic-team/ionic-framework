import { LocationStrategy } from '@angular/common';
import { Directive, ElementRef, HostListener, Input, Optional } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { RouterDirection } from '@ionic/core';
import { Subscription } from 'rxjs';

import { NavController } from '../../providers/nav-controller';

@Directive({
  selector: '[routerLink]',
})
export class RouterLinkDelegate {

  private subscription?: Subscription;

  @Input() routerDirection: RouterDirection = 'forward';

  constructor(
    private locationStrategy: LocationStrategy,
    private navCtrl: NavController,
    private elementRef: ElementRef,
    private router: Router,
    @Optional() private routerLink?: RouterLink,
  ) { }

  ngOnInit() {
    this.updateTargetUrlAndHref();
  }

  ngOnChanges(): any {
    this.updateTargetUrlAndHref();
  }

  ngOnDestroy(): any {
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

  @HostListener('click', ['$event'])
  onClick(ev: UIEvent) {
    this.navCtrl.setDirection(this.routerDirection);
    ev.preventDefault();
  }
}
