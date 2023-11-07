import { Injector, Injectable, EnvironmentInjector, inject } from '@angular/core';
import { AngularDelegate, OverlayBaseController } from '@ionic/angular/common';
import type { ModalOptions } from '@ionic/core/components';
import { modalController } from '@ionic/core/components';

@Injectable()
export class ModalController extends OverlayBaseController<ModalOptions, HTMLIonModalElement> {
  private angularDelegate = inject(AngularDelegate);
  private injector = inject(Injector);
  private environmentInjector = inject(EnvironmentInjector);

  constructor() {
    super(modalController);
  }

  create(opts: ModalOptions): Promise<HTMLIonModalElement> {
    return super.create({
      ...opts,
      delegate: this.angularDelegate.create(this.environmentInjector, this.injector, 'modal'),
    });
  }
}
