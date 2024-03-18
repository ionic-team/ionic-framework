import type { OverlayOptions } from '@utils/overlays-interface';

import type { LiteralUnion } from '../../interface';

export interface ActionSheetOptions extends OverlayOptions {
  header?: string;
  subHeader?: string;
  cssClass?: string | string[];
  buttons: (ActionSheetButton | string)[];
  backdropDismiss?: boolean;
  translucent?: boolean;
  keyboardClose?: boolean;
  htmlAttributes?: { [key: string]: any };
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
