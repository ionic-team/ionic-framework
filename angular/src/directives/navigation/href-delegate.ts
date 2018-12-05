import { Directive, ElementRef, HostListener, Input, Optional } from '@angular/core';
import { NavController, NavDirection } from '../../providers/nav-controller';
import { Router, RouterLink } from '@angular/router';
import { LocationStrategy } from '@angular/common';
import { Subscription } from 'rxjs';


@Directive({
  selector: '[routerLink]',
})
export class HrefDelegate {

  private subscription?: Subscription;

  @Input() routerDirection: NavDirection = 'forward';

  constructor(
    private router: Router,
    private locationStrategy: LocationStrategy,
    private navCtrl: NavController,
    private elementRef: ElementRef,
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
      console.log(href);
      this.elementRef.nativeElement.href = href;
    }
  }

  @HostListener('click', ['$event'])
  onClick(ev: UIEvent) {
    if (this.routerDirection) {
      this.navCtrl.setDirection(this.routerDirection);
    }
    ev.preventDefault();
  }
}

