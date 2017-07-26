import { ToastCmp } from './toast-component';

export interface ToastOptions {
  autoFocus?: boolean;
  message?: string;
  messageHtml?: string;
  cssClass?: string;
  duration?: number;
  showCloseButton?: boolean;
  closeButtonText?: string;
  dismissOnPageChange?: boolean;
  position?: string;
  closeClick?: (component: ToastCmp) => void;
}
