import { AnimationBuilder, ComponentProps, ComponentRef, FrameworkDelegate, Mode } from '../../interface';

export type ModalPresentationStyle = 'fullscreen' | 'card';

export interface ModalOptions<T extends ComponentRef = ComponentRef> {
  component: T;
  componentProps?: ComponentProps<T>;
  presentingEl?: HTMLElement;
  showBackdrop?: boolean;
  backdropDismiss?: boolean;
  cssClass?: string | string[];
  delegate?: FrameworkDelegate;
  animated?: boolean;
  swipeToClose?: boolean;

  mode?: Mode;
  keyboardClose?: boolean;
  id?: string;

  presentationStyle?: ModalPresentationStyle;

  enterAnimation?: AnimationBuilder;
  leaveAnimation?: AnimationBuilder;
}
