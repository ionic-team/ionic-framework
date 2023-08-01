import { Directive } from '@angular/core';
import { IonRouterOutlet as IonRouterOutletBase, ProxyCmp } from '@ionic/angular/common';
import { defineCustomElement } from '@ionic/core/components/ion-router-outlet.js';

@ProxyCmp({
  defineCustomElementFn: defineCustomElement,
})
@Directive({
  selector: 'ion-router-outlet',
  standalone: true,
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class IonRouterOutlet extends IonRouterOutletBase {}
