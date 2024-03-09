import type {
  AnimationBuilder,
  ComponentProps,
  ComponentRef,
  FrameworkDelegate,
  Mode,
  OverlayInterface,
  Theme,
} from '../../interface';

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
  /**
   * @deprecated To change the default appearance of the popover, use the `theme` option.
   * `mode` is deprecated and the ability to set the platform mode will be removed in a major release.
   */
  mode?: Mode;
  theme?: Theme;
  keyboardClose?: boolean;
  id?: string;
  htmlAttributes?: { [key: string]: any };

  enterAnimation?: AnimationBuilder;
  leaveAnimation?: AnimationBuilder;

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
