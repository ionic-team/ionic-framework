import { Injector, Injectable, EnvironmentInjector, inject } from '@angular/core';
import { AngularDelegate, OverlayBaseController } from '@ionic/angular/common';
import type { ModalOptions } from '@ionic/angular/common';
import { modalController } from '@ionic/core';

@Injectable()
export class ModalController extends OverlayBaseController<ModalOptions, HTMLIonModalElement> {
  private angularDelegate = inject(AngularDelegate);
  private injector = inject(Injector);
  private environmentInjector = inject(EnvironmentInjector);

  constructor() {
    super(modalController);
  }

  create(opts: ModalOptions): Promise<HTMLIonModalElement> {
    const { injector: customInjector, ...restOpts } = opts;
    return super.create({
      ...restOpts,
      delegate: this.angularDelegate.create(this.environmentInjector, this.injector, 'modal', customInjector),
    });
  }
}
