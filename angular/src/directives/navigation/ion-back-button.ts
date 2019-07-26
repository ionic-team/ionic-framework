import { Directive, HostListener, Optional } from '@angular/core';

import { NavController } from '../../providers/nav-controller';

import { IonRouterOutlet } from './ion-router-outlet';

@Directive({
  selector: 'ion-back-button',
  inputs: ['defaultHref']
})
export class IonBackButtonDelegate {

  defaultHref: string | undefined | null;

  constructor(
    @Optional() private routerOutlet: IonRouterOutlet,
    private navCtrl: NavController
  ) {}

  /**
   * @internal
   */
  @HostListener('click', ['$event'])
  onClick(ev: Event) {
    if (this.routerOutlet && this.routerOutlet.canGoBack()) {
      this.routerOutlet.pop();
      ev.preventDefault();
    } else if (this.defaultHref != null) {
      this.navCtrl.navigateBack(this.defaultHref);
      ev.preventDefault();
    }
  }
}
