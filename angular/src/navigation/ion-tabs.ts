import { Directive, HostListener } from '@angular/core';
import { Router } from '@angular/router';


@Directive({
  selector: 'ion-tabs'
})
export class Tabs {

  constructor(private router: Router) {}

  @HostListener('ionTabbarClick', ['$event'])
  ionTabbarClick(ev: UIEvent) {
    console.log('ionTabbarClick', ev);

    const tabElm: HTMLIonTabElement = ev.detail as any;
    if (tabElm && tabElm.href) {
      console.log('tabElm', tabElm.href);

      this.router.navigateByUrl(tabElm.href);
    }
  }

}

