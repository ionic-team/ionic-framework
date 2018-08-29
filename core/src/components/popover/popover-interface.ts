import { AnimationBuilder, ComponentProps, ComponentRef, FrameworkDelegate } from '../../interface';

export interface PopoverOptions<T extends ComponentRef = ComponentRef> {
  component: T;
  componentProps?: ComponentProps<T>;
  showBackdrop?: boolean;
  backdropDismiss?: boolean;
  translucent?: boolean;
  enterAnimation?: AnimationBuilder;
  leaveAnimation?: AnimationBuilder;
  cssClass?: string | string[];
  event?: Event;
  delegate?: FrameworkDelegate;
  animated?: boolean;

  mode?: string;
  keyboardClose?: boolean;
  id?: string;
}
