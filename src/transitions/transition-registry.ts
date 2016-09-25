import { Config } from '../config/config';
import { IOSTransition } from './transition-ios';
import { MDTransition } from './transition-md';
import { WPTransition } from './transition-wp';

import { ActionSheetSlideIn, ActionSheetMdSlideIn, ActionSheetSlideOut, ActionSheetMdSlideOut, ActionSheetWpSlideIn, ActionSheetWpSlideOut } from '../components/action-sheet/action-sheet-transitions';
import { AlertPopIn, AlertPopOut, AlertMdPopIn, AlertMdPopOut, AlertWpPopIn, AlertWpPopOut } from '../components/alert/alert-transitions';
import { LoadingPopIn, LoadingPopOut, LoadingMdPopIn, LoadingMdPopOut, LoadingWpPopIn, LoadingWpPopOut } from '../components/loading/loading-transitions';
import { ModalSlideIn, ModalSlideOut, ModalMDSlideIn, ModalMDSlideOut } from '../components/modal/modal-transitions';
import { PickerSlideIn, PickerSlideOut } from '../components/picker/picker-transitions';
import { PopoverPopIn, PopoverPopOut, PopoverMdPopIn, PopoverMdPopOut } from '../components/popover/popover-transitions';
import { ToastSlideIn, ToastSlideOut, ToastMdSlideIn, ToastMdSlideOut, ToastWpPopOut, ToastWpPopIn } from '../components/toast/toast-transitions';


export function registerTransitions(config: Config) {
  return function() {
    config.setTransition('ios-transition', IOSTransition);
    config.setTransition('md-transition', MDTransition);
    config.setTransition('wp-transition', WPTransition);

    config.setTransition('action-sheet-slide-in', ActionSheetSlideIn);
    config.setTransition('action-sheet-slide-out', ActionSheetSlideOut);
    config.setTransition('action-sheet-md-slide-in', ActionSheetMdSlideIn);
    config.setTransition('action-sheet-md-slide-out', ActionSheetMdSlideOut);
    config.setTransition('action-sheet-wp-slide-in', ActionSheetWpSlideIn);
    config.setTransition('action-sheet-wp-slide-out', ActionSheetWpSlideOut);

    config.setTransition('alert-pop-in', AlertPopIn);
    config.setTransition('alert-pop-out', AlertPopOut);
    config.setTransition('alert-md-pop-in', AlertMdPopIn);
    config.setTransition('alert-md-pop-out', AlertMdPopOut);
    config.setTransition('alert-wp-pop-in', AlertWpPopIn);
    config.setTransition('alert-wp-pop-out', AlertWpPopOut);

    config.setTransition('loading-pop-in', LoadingPopIn);
    config.setTransition('loading-pop-out', LoadingPopOut);
    config.setTransition('loading-md-pop-in', LoadingMdPopIn);
    config.setTransition('loading-md-pop-out', LoadingMdPopOut);
    config.setTransition('loading-wp-pop-in', LoadingWpPopIn);
    config.setTransition('loading-wp-pop-out', LoadingWpPopOut);

    config.setTransition('modal-slide-in', ModalSlideIn);
    config.setTransition('modal-slide-out', ModalSlideOut);
    config.setTransition('modal-md-slide-in', ModalMDSlideIn);
    config.setTransition('modal-md-slide-out', ModalMDSlideOut);

    config.setTransition('picker-slide-in', PickerSlideIn);
    config.setTransition('picker-slide-out', PickerSlideOut);

    config.setTransition('popover-pop-in', PopoverPopIn);
    config.setTransition('popover-pop-out', PopoverPopOut);
    config.setTransition('popover-md-pop-in', PopoverMdPopIn);
    config.setTransition('popover-md-pop-out', PopoverMdPopOut);

    config.setTransition('toast-slide-in', ToastSlideIn);
    config.setTransition('toast-slide-out', ToastSlideOut);
    config.setTransition('toast-md-slide-in', ToastMdSlideIn);
    config.setTransition('toast-md-slide-out', ToastMdSlideOut);
    config.setTransition('toast-wp-slide-out', ToastWpPopOut);
    config.setTransition('toast-wp-slide-in', ToastWpPopIn);
  };
}


export function createTransition(config: Config, transitionName: string, enteringView: any, leavingView: any, opts: any) {
  let TransitionClass: any = config.getTransition(transitionName);
  if (!TransitionClass) {
    // didn't find a transition animation, default to ios-transition
    TransitionClass = config.getTransition('ios-transition');
  }

  return new TransitionClass(enteringView, leavingView, opts);
}

