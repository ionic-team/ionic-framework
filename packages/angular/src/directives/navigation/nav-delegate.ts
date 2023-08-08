import { Directive, ElementRef, Injector, EnvironmentInjector, NgZone } from '@angular/core';
import { NavDelegate as NavDelegateBase, AngularDelegate } from '@ionic/angular/common';

@Directive({
  selector: 'ion-nav',
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class NavDelegate extends NavDelegateBase {
  constructor(
    ref: ElementRef,
    environmentInjector: EnvironmentInjector,
    injector: Injector,
    // TODO FW-4766: Remove AngularDelegate
    angularDelegate: AngularDelegate,
    z: NgZone
  ) {
    super(ref, environmentInjector, injector, angularDelegate, z);
  }
}
