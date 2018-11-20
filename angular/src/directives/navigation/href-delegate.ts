import { Directive, ElementRef, HostListener, Input, Optional } from '@angular/core';
import { Router, RouterLink, RouterLinkWithHref } from '@angular/router';
import { NavController, NavDirection } from '../../providers/nav-controller';

@Directive({
  selector: '[routerLink],[routerDirection],ion-anchor,ion-button,ion-item'
})
export class HrefDelegate {

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
    @Optional() private routerLink: RouterLink,
    @Optional() private routerLinkWithHref: RouterLinkWithHref,
    private navCtrl: NavController,
    private elementRef: ElementRef
  ) {}

  @HostListener('click', ['$event', '$event.button', '$event.ctrlKey', '$event.metaKey', '$event.shiftKey'])
  onClick(ev: Event, button: number, ctrlKey: boolean, metaKey: boolean, shiftKey: boolean) {
    
    let url: string | null = this.href;
    if (!this.router || (url && (url[0] === '#' || url.indexOf('://') > -1))) {
      url = null;
    }
    
    if (this.routerLink || this.routerLinkWithHref || url) {
      ev.preventDefault();
      this.navCtrl.setDirection(this.routerDirection);

      if (this.routerLink) {
        this.routerLink.onClick();
      } else if (this.routerLinkWithHref) {
        this.routerLinkWithHref.onClick(button, ctrlKey, metaKey, shiftKey);
      } else if (url != null) {
        this.router.navigateByUrl(url);
      }
    }
  }
}
