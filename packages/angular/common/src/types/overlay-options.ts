import type { Injector } from '@angular/core';
import type { ModalOptions, PopoverOptions } from '@ionic/core/components';

export interface AngularModalOptions extends ModalOptions {
  injector?: Injector;
}

export interface AngularPopoverOptions extends PopoverOptions {
  injector?: Injector;
}
