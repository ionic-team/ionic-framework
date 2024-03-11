import type { OverlayOptions } from '@utils/overlays-interface';

import type { ComponentProps, ComponentRef, FrameworkDelegate, OverlayInterface } from '../../interface';

export interface PopoverInterface extends OverlayInterface {
  present: (event?: MouseEvent | TouchEvent | PointerEvent) => Promise<void>;
}

export interface PopoverOptions<T extends ComponentRef = ComponentRef> extends OverlayOptions {
  component: T;
  componentProps?: ComponentProps<T>;
  showBackdrop?: boolean;
  backdropDismiss?: boolean;
  translucent?: boolean;
  cssClass?: string | string[];
  event?: Event;
  delegate?: FrameworkDelegate;
  keyboardClose?: boolean;
  htmlAttributes?: { [key: string]: any };

  size?: PopoverSize;
  dismissOnSelect?: boolean;
  reference?: PositionReference;
  side?: PositionSide;
  alignment?: PositionAlign;
  arrow?: boolean;

  trigger?: string;
  triggerAction?: string;
}

export type PopoverSize = 'cover' | 'auto';

export type TriggerAction = 'click' | 'hover' | 'context-menu';

export type PositionReference = 'trigger' | 'event';
export type PositionSide = 'top' | 'right' | 'bottom' | 'left' | 'start' | 'end';
export type PositionAlign = 'start' | 'center' | 'end';
