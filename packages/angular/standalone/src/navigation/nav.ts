import { Component, ElementRef, Injector, EnvironmentInjector, NgZone, ChangeDetectorRef } from '@angular/core';
import { IonNav as IonNavBase, ProxyCmp, AngularDelegate } from '@ionic/angular/common';
import { defineCustomElement } from '@ionic/core/components/ion-nav.js';

@ProxyCmp({
  defineCustomElementFn: defineCustomElement,
})
@Component({
  selector: 'ion-nav',
  template: '<ng-content></ng-content>',
  standalone: true,
})
export class IonNav extends IonNavBase {
  constructor(
    ref: ElementRef,
    environmentInjector: EnvironmentInjector,
    injector: Injector,
    angularDelegate: AngularDelegate,
    z: NgZone,
    c: ChangeDetectorRef
  ) {
    super(ref, environmentInjector, injector, angularDelegate, z, c);
  }
}
