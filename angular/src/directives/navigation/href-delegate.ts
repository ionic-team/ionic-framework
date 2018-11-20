import { Directive, ElementRef, HostListener, Input, Optional } from '@angular/core';
import { Router, RouterLink, RouterLinkWithHref } from '@angular/router';
import { NavController, NavIntent } from '../../providers/nav-controller';

export type RouterDirection =  'forward' | 'back' | 'root' | 'auto';

@Directive({
  selector: '[routerDirection],ion-anchor,ion-button,ion-item'
})
export class HrefDelegate {

  @Input() routerDirection: RouterDirection = 'forward';

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
  ) {

    if (routerLink || routerLinkWithHref) {
      this.elementRef.nativeElement.button = true;
    }
  }

  @HostListener('click', ['$event', '$event.button', '$event.ctrlKey', '$event.metaKey', '$event.shiftKey'])
  onClick(ev: Event, button: number, ctrlKey: boolean, metaKey: boolean, shiftKey: boolean) {
    
    let url: string | null = this.href;
    if (!this.router || (url && (url[0] === '#' || url.indexOf('://') > -1))) {
      url = null;
    }
    
    if (this.routerLink || this.routerLinkWithHref || url) {
      ev.preventDefault();
      this.navCtrl.setIntent(textToIntent(this.routerDirection));

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

function textToIntent(direction: RouterDirection) {
  switch (direction) {
    case 'forward': return NavIntent.Forward;
    case 'back': return NavIntent.Back;
    case 'root': return NavIntent.Root;
    default: return NavIntent.Auto;
  }
}
