import { Mode } from '../interface';

export interface IonicConfig {
  /**
   * The mode determines which platform styles to use.
   * Possible values are: `"ios"` or `"md"`.
   */
  mode?: Mode;
  persistConfig?: boolean;

  isDevice?: boolean;
  statusbarPadding?: boolean;
  inputShims?: boolean;
  backButtonIcon?: string;
  backButtonText?: string;
  spinner?: string;
  loadingSpinner?: string;
  menuIcon?: string;
  animate?: boolean;
  pickerSpinner?: string;
  refreshingIcon?: string;
  refreshingSpinner?: string;
  menuType?: string;
  scrollPadding?: string;
  inputBlurring?: string;
  scrollAssist?: string;
  hideCaretOnScroll?: string;
  infiniteLoadingSpinner?: string;
  keyboardHeight?: number;
  swipeBackEnabled?: boolean;

  tabbarPlacement?: string;
  tabbarLayout?: string;
  tabbarHighlight?: boolean;

  actionSheetEnter?: string;
  alertEnter?: string;
  loadingEnter?: string;
  modalEnter?: string;
  popoverEnter?: string;
  toastEnter?: string;
  pickerEnter?: string;

  actionSheetLeave?: string;
  alertLeave?: string;
  loadingLeave?: string;
  modalLeave?: string;
  popoverLeave?: string;
  toastLeave?: string;
  pickerLeave?: string;
}

export class Config {

  private m: Map<keyof IonicConfig, any>;

  constructor(configObj: IonicConfig) {
    this.m = new Map<keyof IonicConfig, any>(Object.entries(configObj) as any);
  }

  get(key: keyof IonicConfig, fallback?: any): any {
    const value = this.m.get(key);
    return (value !== undefined) ? value : fallback;
  }

  getBoolean(key: keyof IonicConfig, fallback = false): boolean {
    const val = this.m.get(key);
    if (val === undefined) {
      return fallback;
    }
    if (typeof val === 'string') {
      return val === 'true';
    }
    return !!val;
  }

  getNumber(key: keyof IonicConfig, fallback?: number): number {
    const val = parseFloat(this.m.get(key));
    return isNaN(val) ? (fallback !== undefined ? fallback : NaN) : val;
  }

  set(key: keyof IonicConfig, value: any) {
    this.m.set(key, value);
  }
}
