import { Directive, HostListener, Optional } from '@angular/core';
import { Router } from '@angular/router';

@Directive({
  selector: 'ion-tabs'
})
export class TabsDelegate {

  constructor(
    @Optional() private router: Router,
  ) {}

  @HostListener('ionTabbarClick', ['$event'])
  ionTabbarClick(ev: UIEvent) {
    const tabElm: HTMLIonTabElement = ev.detail as any;
    if (this.router && tabElm && tabElm.href) {
      this.router.navigateByUrl(tabElm.href);
    }
  }

}

