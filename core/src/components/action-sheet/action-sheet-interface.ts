import type { AnimationBuilder, LiteralUnion, Mode } from '../../interface';

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
  /**
   * When `disabled` is `true` the action
   * sheet button will not be interactive. Note
   * that buttons with a 'cancel' role cannot
   * be disabled as that would make it difficult for
   * users to dismiss the action sheet.
   */
  disabled?: boolean;
}
