import { ChangeDetectorRef, Component, Directive, ElementRef, NgZone } from '@angular/core';

import { IonBackButton as IonBackButtonBase, IonBackButtonDelegate as IonBackButtonDelegateBase } from '@ionic/angular';
import { defineCustomElement } from '@ionic/core/components/ion-back-button.js';
import { ProxyCmp } from '@ionic/angular/common';

@Directive({
  selector: 'ion-back-button',
  standalone: true
})
class IonBackButtonDelegate extends IonBackButtonDelegateBase {}

@ProxyCmp({
  inputs: ['color', 'defaultHref', 'disabled', 'icon', 'mode', 'routerAnimation', 'text', 'type']
})
@Component({
  selector: 'ion-back-button',
  standalone: true,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['color', 'defaultHref', 'disabled', 'icon', 'mode', 'routerAnimation', 'text', 'type'],
  imports: [IonBackButtonDelegate]
})
export class IonBackButton extends IonBackButtonBase {
  constructor(c: ChangeDetectorRef, r: ElementRef, z: NgZone) {
    super(c, r, z);
    defineCustomElement();
  }
}
