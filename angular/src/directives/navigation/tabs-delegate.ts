import { Directive, ElementRef, HostListener, Optional } from '@angular/core';
import { Router } from '@angular/router';

@Directive({
  selector: 'ion-tabs'
})
export class TabsDelegate {

  constructor(
    @Optional() private router: Router,
    elementRef: ElementRef
  ) {
    if (router) {
      elementRef.nativeElement.useRouter = true;
    }
  }

  @HostListener('ionTabbarClick', ['$event'])
  onTabbarClick(ev: UIEvent) {
    const tabElm: HTMLIonTabElement = ev.detail as any;
    if (this.router && tabElm && tabElm.href) {
      this.router.navigateByUrl(tabElm.href);
    }
  }
}
