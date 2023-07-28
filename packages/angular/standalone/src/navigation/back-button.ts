import { Component, Directive } from '@angular/core';

import { IonBackButton as IonBackButtonBase, IonBackButtonDelegate as IonBackButtonDelegateBase, ProxyCmp } from '@ionic/angular';
import { defineCustomElement } from '@ionic/core/components/ion-back-button.js';

@Directive({
  selector: 'ion-back-button',
  standalone: true
})
class IonBackButtonDelegate extends IonBackButtonDelegateBase {}

@ProxyCmp({
  defineCustomElementFn: defineCustomElement
})
@Component({
  selector: 'ion-back-button',
  standalone: true,
  template: '<ng-content></ng-content>',
  imports: [IonBackButtonDelegate]
})
export class IonBackButton extends IonBackButtonBase {}
