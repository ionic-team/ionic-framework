
export interface ActionSheetOptions {
  title?: string;
  subTitle?: string;
  cssClass?: string;
  mode?: string;
  buttons?: (ActionSheetButton|string)[];
  enableBackdropDismiss?: boolean;
}

export interface ActionSheetButton {
  text?: string;
  role?: string;
  icon?: string;
  cssClass?: string;
  handler?: () => boolean|void;
}
