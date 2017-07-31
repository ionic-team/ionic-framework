import { ToastCmp } from './toast-component';

export interface ToastOptions {
  autoFocus?: boolean;
  message?: string;
  messageHtml?: string;
  cssClass?: string;
  duration?: number;
  closeButton?: {
    text?: string;
    color?: string;
  };
  /**
   * @deprecated
   */
  showCloseButton?: boolean;
  /**
   * @deprecated
   */
  closeButtonText?: string;
  /**
   * @deprecated
   */
  closeButtonColor?: string;
  dismissOnPageChange?: boolean;
  position?: string;
  closeClick?: (component: ToastCmp) => void;
}
