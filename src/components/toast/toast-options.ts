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
  showCloseButton?: boolean;
  closeButtonText?: string;
  closeButtonColor?: string;
  dismissOnPageChange?: boolean;
  position?: string;
  closeClick?: (component: ToastCmp) => void;
}
