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
   * @deprecated To change the default appearance of the popover, use the `theme` option.
   * `mode` is deprecated and the ability to set the platform mode will be removed in a major release.
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
  /**
   * When `disabled` is `true` the action
   * sheet button will not be interactive. Note
   * that buttons with a 'cancel' role cannot
   * be disabled as that would make it difficult for
   * users to dismiss the action sheet.
   */
  disabled?: boolean;
}
