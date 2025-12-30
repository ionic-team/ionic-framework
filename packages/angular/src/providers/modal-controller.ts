import { Injector, Injectable, EnvironmentInjector, inject } from '@angular/core';
import { AngularDelegate, OverlayBaseController } from '@ionic/angular/common';
import type { AngularModalOptions } from '@ionic/angular/common';
import { modalController } from '@ionic/core';

@Injectable()
export class ModalController extends OverlayBaseController<AngularModalOptions, HTMLIonModalElement> {
  private angularDelegate = inject(AngularDelegate);
  private injector = inject(Injector);
  private environmentInjector = inject(EnvironmentInjector);

  constructor() {
    super(modalController);
  }

  create(opts: AngularModalOptions): Promise<HTMLIonModalElement> {
    const { injector: customInjector, ...restOpts } = opts;
    return super.create({
      ...restOpts,
      delegate: this.angularDelegate.create(this.environmentInjector, this.injector, 'modal', customInjector),
    });
  }
}
