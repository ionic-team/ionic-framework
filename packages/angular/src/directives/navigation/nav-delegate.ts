import { Component } from '@angular/core';
import { IonNavDelegate as IonNavDelegateBase } from '@ionic/angular/common';

@Component({
  selector: 'ion-nav',
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class NavDelegate extends IonNavDelegateBase {}
