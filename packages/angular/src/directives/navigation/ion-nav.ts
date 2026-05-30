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
  selector: 'ion-nav',
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
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
