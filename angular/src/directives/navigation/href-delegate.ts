import { Directive, ElementRef, HostListener, Input, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, NavDirection } from '../../providers/nav-controller';


@Directive({
  selector: '[routerLink],[routerDirection],ion-anchor,ion-button,ion-item'
})
export class HrefDelegate {

  @Input() routerLink: any;
  @Input() routerDirection: NavDirection = 'forward';

  @Input()
  set href(value: string) {
    this.elementRef.nativeElement.href = value;
  }
  get href() {
    return this.elementRef.nativeElement.href;
  }

  constructor(
    @Optional() private router: Router,
    private navCtrl: NavController,
    private elementRef: ElementRef
  ) {}

  @HostListener('click', ['$event'])
  onClick(ev: Event) {
    const url = this.href;
    if (this.routerDirection) {
      this.navCtrl.setDirection(this.routerDirection);
    }

    if (!this.routerLink && this.router && url != null && url[0] !== '#' && url.indexOf('://') === -1) {
      ev.preventDefault();
      this.router.navigateByUrl(url);
    }
  }
}
