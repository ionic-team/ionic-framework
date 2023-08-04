import { Component, ElementRef, Injector, EnvironmentInjector, NgZone } from '@angular/core';
import { NavDelegate as NavDelegateBase, ProxyCmp, AngularDelegate } from '@ionic/angular/common';
import { defineCustomElement } from '@ionic/core/components/ion-nav.js';

@ProxyCmp({
  defineCustomElementFn: defineCustomElement,
})
@Component({
  selector: 'ion-nav',
  template: '<ng-content></ng-content>',
  standalone: true,
})
export class IonNav extends NavDelegateBase {
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
