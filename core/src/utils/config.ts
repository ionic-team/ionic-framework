import { AnimationBuilder, Mode } from '../interface';

export interface IonicConfig {
  /**
   * The mode determines which platform styles to use.
   * Possible values are: `"ios"` or `"md"`.
   */
  mode?: Mode;
  persistConfig?: boolean;
  hardwareBackButton?: boolean;
  statusTap?: boolean;

  inputShims?: boolean;
  backButtonIcon?: string;
  backButtonText?: string;
  spinner?: string;
  loadingSpinner?: string;
  menuIcon?: string;
  animated?: boolean;
  pickerSpinner?: string;
  refreshingIcon?: string;
  refreshingSpinner?: string;
  menuType?: string;
  scrollPadding?: string;
  inputBlurring?: string;
  scrollAssist?: boolean;
  hideCaretOnScroll?: string;
  infiniteLoadingSpinner?: string;
  keyboardHeight?: number;
  swipeBackEnabled?: boolean;

  tabbarPlacement?: string;
  tabbarLayout?: string;
  tabbarHighlight?: boolean;

  navAnimation?: AnimationBuilder;

  actionSheetEnter?: AnimationBuilder;
  alertEnter?: AnimationBuilder;
  loadingEnter?: AnimationBuilder;
  modalEnter?: AnimationBuilder;
  popoverEnter?: AnimationBuilder;
  toastEnter?: AnimationBuilder;
  pickerEnter?: AnimationBuilder;

  actionSheetLeave?: AnimationBuilder;
  alertLeave?: AnimationBuilder;
  loadingLeave?: AnimationBuilder;
  modalLeave?: AnimationBuilder;
  popoverLeave?: AnimationBuilder;
  toastLeave?: AnimationBuilder;
  pickerLeave?: AnimationBuilder;

  _forceStatusbarPadding?: boolean;
}

export function setupConfig(config: IonicConfig) {
  const win = window as any;
  const Ionic = win.Ionic;
  if (Ionic && Ionic.config && Ionic.config.constructor.name !== 'Object') {
    console.error('ionic config was already initialized');
    return;
  }
  win.Ionic = win.Ionic || {};
  win.Ionic.config = {
    ...win.Ionic.config,
    ...config
  };
  return win.Ionic.config;
}
