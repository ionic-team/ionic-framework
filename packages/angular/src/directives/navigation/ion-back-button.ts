import { Directive, Optional, ElementRef, NgZone } from '@angular/core';
import { IonBackButtonDelegate as IonBackButtonDelegateBase, NavController, Config } from '@ionic/angular/common';

import { IonRouterOutlet } from './ion-router-outlet';

@Directive({
  selector: 'ion-back-button',
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class IonBackButtonDelegateDirective extends IonBackButtonDelegateBase {
  constructor(
    @Optional() routerOutlet: IonRouterOutlet,
    navCtrl: NavController,
    config: Config,
    r: ElementRef,
    z: NgZone
  ) {
    super(routerOutlet, navCtrl, config, r, z);
  }
}
