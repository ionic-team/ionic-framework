import { AnimationBuilder, ComponentProps, ComponentRef, FrameworkDelegate } from '../../interface';

export interface PopoverOptions {
  component: ComponentRef;
  componentProps?: ComponentProps;
  showBackdrop?: boolean;
  enableBackdropDismiss?: boolean;
  translucent?: boolean;
  enterAnimation?: AnimationBuilder;
  leaveAnimation?: AnimationBuilder;
  cssClass?: string | string[];
  ev: Event;
  delegate?: FrameworkDelegate;
}
