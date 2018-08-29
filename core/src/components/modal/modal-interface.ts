import { AnimationBuilder, ComponentProps, ComponentRef, FrameworkDelegate } from '../../interface';

export interface ModalOptions<T extends ComponentRef = ComponentRef> {
  component: T;
  componentProps?: ComponentProps<T>;
  showBackdrop?: boolean;
  backdropDismiss?: boolean;
  enterAnimation?: AnimationBuilder;
  leaveAnimation?: AnimationBuilder;
  cssClass?: string | string[];
  delegate?: FrameworkDelegate;
  animated?: boolean;

  mode?: string;
  keyboardClose?: boolean;
  id?: string;
}
