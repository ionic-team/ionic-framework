import type { AnimationBuilder, LiteralUnion, Mode, Theme } from '../../interface';

export interface ActionSheetOptions {
  header?: string;
  subHeader?: string;
  cssClass?: string | string[];
  buttons: (ActionSheetButton | string)[];
  backdropDismiss?: boolean;
  translucent?: boolean;
  animated?: boolean;
  /**
   * The platform behavior of the action sheet.
   */
  mode?: Mode;
  /**
   * The visual appearance of the action sheet.
   */
  theme?: Theme;
  keyboardClose?: boolean;
  id?: string;
  htmlAttributes?: { [key: string]: any };

  enterAnimation?: AnimationBuilder;
  leaveAnimation?: AnimationBuilder;
}

export interface ActionSheetButton<T = any> {
  text?: string;
  role?: LiteralUnion<'cancel' | 'destructive' | 'selected', string>;
  icon?: string;
  cssClass?: string | string[];
  id?: string;
  htmlAttributes?: { [key: string]: any };
  handler?: () => boolean | void | Promise<boolean | void>;
  data?: T;
}
