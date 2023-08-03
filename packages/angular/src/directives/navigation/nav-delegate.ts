import { Directive, ElementRef, Injector, EnvironmentInjector, NgZone } from '@angular/core';
import { NavDelegate as NavDelegateBase, NAV_DELEGATE_SELECTOR, AngularDelegate } from '@ionic/angular/common';

@Directive({
  selector: NAV_DELEGATE_SELECTOR,
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
