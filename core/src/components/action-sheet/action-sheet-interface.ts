import type { JSXBase } from '@stencil/core/internal';

import type { AnimationBuilder, Mode } from '../../interface';

export interface ActionSheetOptions {
  header?: string;
  subHeader?: string;
  cssClass?: string | string[];
  buttons: (ActionSheetButton | string)[];
  backdropDismiss?: boolean;
  translucent?: boolean;
  animated?: boolean;
  mode?: Mode;
  keyboardClose?: boolean;
  id?: string;
  htmlAttributes?: ActionSheetAttributes;

  enterAnimation?: AnimationBuilder;
  leaveAnimation?: AnimationBuilder;
}

export type ActionSheetAttributes = JSXBase.HTMLAttributes<HTMLElement>;

export interface ActionSheetButton<T = any> {
  text?: string;
  role?: 'cancel' | 'destructive' | 'selected' | string;
  icon?: string;
  cssClass?: string | string[];
  id?: string;
  handler?: () => boolean | void | Promise<boolean | void>;
  data?: T;
}
