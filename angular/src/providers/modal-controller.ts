import { ComponentFactoryResolver, Injector, Injectable, Optional } from '@angular/core';
import { ModalOptions, modalController } from '@ionic/core';

import { EnvironmentInjector } from '../di/r3_injector';
import { OverlayBaseController } from '../util/overlay';

import { AngularDelegate } from './angular-delegate';

@Injectable()
export class ModalController extends OverlayBaseController<ModalOptions, HTMLIonModalElement> {
  constructor(
    private angularDelegate: AngularDelegate,
    private resolver: ComponentFactoryResolver,
    private injector: Injector,
    // TODO: FW-1641: Migrate to Angular's version once Angular 13 is dropped
    @Optional() private environmentInjector: EnvironmentInjector
  ) {
    super(modalController);
  }

  create(opts: ModalOptions): Promise<HTMLIonModalElement> {
    return super.create({
      ...opts,
      delegate: this.angularDelegate.create(
        this.resolver ?? this.environmentInjector,
        this.injector,
        undefined,
        'modal'
      ),
    });
  }
}
