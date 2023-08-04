import { Directive, Optional } from '@angular/core';
import { IonBackButton as IonBackButtonBase, NavController, Config } from '@ionic/angular/common';

import { IonRouterOutlet } from './ion-router-outlet';

@Directive({
  selector: 'ion-back-button',
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class IonBackButtonDelegateDirective extends IonBackButtonBase {
  constructor(@Optional() routerOutlet: IonRouterOutlet, navCtrl: NavController, config: Config) {
    super(routerOutlet, navCtrl, config);
  }
}
