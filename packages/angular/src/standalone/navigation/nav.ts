import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  EnvironmentInjector,
  NgZone,
  ChangeDetectorRef,
} from '@angular/core';
import { IonNav as IonNavBase, ProxyCmp, AngularDelegate } from '@ionic/angular/common';
import { defineCustomElement } from '@ionic/core/components/ion-nav.js';

@ProxyCmp({
  defineCustomElementFn: defineCustomElement,
})
@Component({
  selector: 'ion-nav',
  // Unlike ion-router-outlet, the delegate attaches pages here as root views and
  // IonNavBase detaches this one, so a tick never descends through it (#31406).
  changeDetection: ChangeDetectionStrategy.OnPush,
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
