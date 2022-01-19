import { JSXBase } from '@stencil/core/internal';

import { AnimationBuilder, ComponentProps, ComponentRef, FrameworkDelegate, Mode, OverlayInterface } from '../../interface';

export interface PopoverInterface extends OverlayInterface {
  present: (event?: MouseEvent | TouchEvent | PointerEvent) => Promise<void>;
}

export interface PopoverOptions<T extends ComponentRef = ComponentRef> {
  component: T;
  componentProps?: ComponentProps<T>;
  showBackdrop?: boolean;
  backdropDismiss?: boolean;
  translucent?: boolean;
  cssClass?: string | string[];
  event?: Event;
  delegate?: FrameworkDelegate;
  animated?: boolean;

  mode?: Mode;
  keyboardClose?: boolean;
  id?: string;
  htmlAttributes?: PopoverAttributes;

  enterAnimation?: AnimationBuilder;
  leaveAnimation?: AnimationBuilder;

  size?: PopoverSize;
  dismissOnSelect?: boolean;
  reference?: PositionReference;
  side?: PositionSide;
  align?: PositionAlign;
  arrow?: boolean;

  trigger?: string;
  triggerAction?: string;
}

export interface PopoverAttributes extends JSXBase.HTMLAttributes<HTMLElement> { }

export type PopoverSize = 'cover' | 'auto';

export type TriggerAction = 'click' | 'hover' | 'context-menu';

export type PositionReference = 'trigger' | 'event';
export type PositionSide = 'top' | 'right' | 'bottom' | 'left' | 'start' | 'end';
export type PositionAlign = 'start' | 'center' | 'end';
