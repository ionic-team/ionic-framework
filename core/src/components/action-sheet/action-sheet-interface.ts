
export interface ActionSheetOptions {
  header?: string;
  subHeader?: string;
  cssClass?: string;
  buttons: (ActionSheetButton | string)[];
  enableBackdropDismiss?: boolean;
  translucent?: boolean;
}

export interface ActionSheetButton {
  text?: string;
  role?: 'cancel' | 'destructive' | 'selected' | string;
  icon?: string;
  cssClass?: string;
  handler?: () => boolean | void;
}

