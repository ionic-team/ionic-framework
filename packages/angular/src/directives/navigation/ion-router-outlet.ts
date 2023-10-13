import { Directive } from '@angular/core';
import { IonRouterOutlet as IonRouterOutletBase } from '@ionic/angular/common';

@Directive({
  selector: 'ion-router-outlet',
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class IonRouterOutlet extends IonRouterOutletBase {}
