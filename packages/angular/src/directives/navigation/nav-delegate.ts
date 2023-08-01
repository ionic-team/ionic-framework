import { Directive } from '@angular/core';
import { NavDelegate as NavDelegateBase } from '@ionic/angular/common';

@Directive({
  selector: 'ion-nav',
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class NavDelegate extends NavDelegateBase {}
