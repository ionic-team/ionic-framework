import {
  ElementRef,
  Injector,
  EnvironmentInjector,
  NgZone,
  ChangeDetectorRef,
  Component,
  ChangeDetectionStrategy,
} from '@angular/core';
import { IonNav as IonNavBase, AngularDelegate } from '@ionic/angular/common';

@Component({
  standalone: false,
  selector: 'ion-nav',
  template: '<ng-content></ng-content>',
  // Unlike ion-router-outlet, the delegate attaches pages here as root views and
  // IonNavBase detaches this one, so a tick never descends through it.
  changeDetection: ChangeDetectionStrategy.OnPush,
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
