import { Optional, ElementRef, NgZone, ChangeDetectorRef, Component, ChangeDetectionStrategy } from '@angular/core';
import { IonBackButton as IonBackButtonBase, NavController, Config } from '@ionic/angular/common';

import { IonRouterOutlet } from './ion-router-outlet';

@Component({
  selector: 'ion-back-button',
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class IonBackButton extends IonBackButtonBase {
  constructor(
    @Optional() routerOutlet: IonRouterOutlet,
    navCtrl: NavController,
    config: Config,
    r: ElementRef,
    z: NgZone,
    c: ChangeDetectorRef
  ) {
    super(routerOutlet, navCtrl, config, r, z, c);
  }
}
