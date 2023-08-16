import { Component, Optional, ChangeDetectionStrategy, ElementRef, NgZone, ChangeDetectorRef } from '@angular/core';
import { IonBackButton as IonBackButtonBase, NavController, Config, ProxyCmp } from '@ionic/angular/common';
import { defineCustomElement } from '@ionic/core/components/ion-back-button.js';

import { IonRouterOutlet } from './router-outlet';

@ProxyCmp({
  defineCustomElementFn: defineCustomElement,
})
@Component({
  selector: 'ion-back-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  standalone: true,
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
