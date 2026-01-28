import type { Injector } from '@angular/core';
import type { ModalOptions as CoreModalOptions, PopoverOptions as CorePopoverOptions } from '@ionic/core/components';

/**
 * Modal options with Angular-specific injector support.
 * Extends @ionic/core ModalOptions with an optional injector property.
 */
export type ModalOptions = CoreModalOptions & {
  injector?: Injector;
};

/**
 * Popover options with Angular-specific injector support.
 * Extends @ionic/core PopoverOptions with an optional injector property.
 */
export type PopoverOptions = CorePopoverOptions & {
  injector?: Injector;
};
