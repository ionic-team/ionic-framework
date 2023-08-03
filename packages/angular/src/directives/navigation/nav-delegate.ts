import { Directive, ElementRef, Injector, EnvironmentInjector } from '@angular/core';
import { IonNavDelegate as IonNavDelegateBase, NAV_DELEGATE_SELECTOR, AngularDelegate } from '@ionic/angular/common';

@Directive({
  selector: NAV_DELEGATE_SELECTOR,
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class IonNavDelegate extends IonNavDelegateBase {
  constructor(
    ref: ElementRef,
    environmentInjector: EnvironmentInjector,
    injector: Injector,
    angularDelegate: AngularDelegate
  ) {
    super(ref, environmentInjector, injector, angularDelegate);
  }
}
