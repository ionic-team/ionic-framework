import { Component, ElementRef, Injector, EnvironmentInjector } from '@angular/core';
import {
  NavDelegate as NavDelegateBase,
  ProxyCmp,
  NAV_DELEGATE_SELECTOR,
  NAV_DELEGATE_TEMPLATE,
  AngularDelegate,
} from '@ionic/angular/common';
import { defineCustomElement } from '@ionic/core/components/ion-nav.js';

@ProxyCmp({
  defineCustomElementFn: defineCustomElement,
})
@Component({
  selector: NAV_DELEGATE_SELECTOR,
  template: NAV_DELEGATE_TEMPLATE,
  standalone: true,
})
export class IonNav extends NavDelegateBase {
  constructor(
    ref: ElementRef,
    environmentInjector: EnvironmentInjector,
    injector: Injector,
    angularDelegate: AngularDelegate
  ) {
    super(ref, environmentInjector, injector, angularDelegate);
  }
}
