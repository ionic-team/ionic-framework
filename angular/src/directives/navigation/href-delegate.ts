import { Directive, ElementRef, HostListener, Input, Optional } from '@angular/core';
import { Router, RouterLink, RouterLinkWithHref } from '@angular/router';
import { NavController, NavDirection } from '../../providers/nav-controller';

@Directive({
  selector: '[routerLink],[routerDirection]'
})
export class HrefDelegate {

  @Input() routerDirection: NavDirection = 'forward';

  @Input() target: any;

  @Input()
  set href(value: string) {
    this.elementRef.nativeElement.href = value;
  }
  get href() {
    return this.elementRef.nativeElement.href;
  }

  constructor(
    @Optional() private router: Router,
    @Optional() private routerLink: RouterLink,
    @Optional() private routerLinkWithHref: RouterLinkWithHref,
    private navCtrl: NavController,
    private elementRef: ElementRef
  ) {}

  @HostListener('click', ['$event'])
  onClick(ev: Event) {

    let url: string | null = this.href;
    if (!this.router || (url && (url[0] === '#' || url.indexOf('://') > -1))) {
      url = null;
    }

    if (typeof this.target === 'string' && this.target != '_self') {
      return;
    }
    
    if (this.routerDirection && (this.routerLink || this.routerLinkWithHref || url)) {
      this.navCtrl.setDirection(this.routerDirection);
    }

    if (!this.routerLink && !this.routerLinkWithHref && url) {
      ev.preventDefault();
      this.router.navigateByUrl(url);
    }
  }
}
