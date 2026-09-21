import type { Injector } from '@angular/core';
import type {
  ComponentRef,
  ModalOptions as CoreModalOptions,
  PopoverOptions as CorePopoverOptions,
} from '@ionic/core/components';

/**
 * Modal options with Angular-specific injector support.
 * Extends @ionic/core ModalOptions with an optional injector property.
 */
export type ModalOptions<T extends ComponentRef = ComponentRef> = CoreModalOptions<T> & {
  injector?: Injector;
};

/**
 * Popover options with Angular-specific injector support.
 * Extends @ionic/core PopoverOptions with an optional injector property.
 */
export type PopoverOptions<T extends ComponentRef = ComponentRef> = CorePopoverOptions<T> & {
  injector?: Injector;
};
