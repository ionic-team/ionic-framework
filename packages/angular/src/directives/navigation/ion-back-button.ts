import { Directive } from '@angular/core';
import { IonBackButton as IonBackButtonBase } from '@ionic/angular/common';

@Directive({
  selector: 'ion-back-button',
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class IonBackButtonDelegateDirective extends IonBackButtonBase {}
