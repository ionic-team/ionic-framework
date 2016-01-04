
import {Config} from './config';


// iOS Mode Settings
Config.setModeConfig('ios', {
  activator: 'highlight',

  actionSheetEnter: 'action-sheet-slide-in',
  actionSheetLeave: 'action-sheet-slide-out',
  actionSheetCancelIcon: '',
  actionSheetDestructiveIcon: '',

  alertEnter: 'alert-pop-in',
  alertLeave: 'alert-pop-out',

  backButtonText: 'Back',
  backButtonIcon: 'ion-ios-arrow-back',

  iconMode: 'ios',

  menuType: 'reveal',

  modalEnter: 'modal-slide-in',
  modalLeave: 'modal-slide-out',

  pageTransition: 'ios-transition',
  pageTransitionDelay: 16,

  tabbarPlacement: 'bottom',
});


// Material Design Mode Settings
Config.setModeConfig('md', {
  activator: 'ripple',

  actionSheetEnter: 'action-sheet-md-slide-in',
  actionSheetLeave: 'action-sheet-md-slide-out',
  actionSheetCancelIcon: 'ion-md-close',
  actionSheetDestructiveIcon: 'ion-md-trash',

  alertEnter: 'alert-md-pop-in',
  alertLeave: 'alert-md-pop-out',

  backButtonText: '',
  backButtonIcon: 'ion-md-arrow-back',

  iconMode: 'md',

  menuType: 'overlay',

  modalEnter: 'modal-md-slide-in',
  modalLeave: 'modal-md-slide-out',

  pageTransition: 'md-transition',
  pageTransitionDelay: 120,

  tabbarHighlight: true,
  tabbarPlacement: 'top',

  tabSubPages: true,
});
