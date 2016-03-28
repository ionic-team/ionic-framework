
import {Config} from './config';


// iOS Mode Settings
Config.setModeConfig('ios', {
  activator: 'highlight',

  actionSheetEnter: 'action-sheet-slide-in',
  actionSheetLeave: 'action-sheet-slide-out',

  alertEnter: 'alert-pop-in',
  alertLeave: 'alert-pop-out',

  backButtonText: 'Back',
  backButtonIcon: 'ios-arrow-back',

  iconMode: 'ios',

  loadingEnter: 'loading-pop-in',
  loadingLeave: 'loading-pop-out',

  menuType: 'reveal',

  modalEnter: 'modal-slide-in',
  modalLeave: 'modal-slide-out',

  pageTransition: 'ios-transition',
  pageTransitionDelay: 16,

  spinner: 'ios',

  tabbarPlacement: 'bottom',
});


// Material Design Mode Settings
Config.setModeConfig('md', {
  activator: 'ripple',

  actionSheetEnter: 'action-sheet-md-slide-in',
  actionSheetLeave: 'action-sheet-md-slide-out',

  alertEnter: 'alert-md-pop-in',
  alertLeave: 'alert-md-pop-out',

  backButtonText: '',
  backButtonIcon: 'md-arrow-back',

  iconMode: 'md',

  loadingEnter: 'loading-md-pop-in',
  loadingLeave: 'loading-md-pop-out',

  menuType: 'overlay',

  modalEnter: 'modal-md-slide-in',
  modalLeave: 'modal-md-slide-out',

  pageTransition: 'md-transition',
  pageTransitionDelay: 96,

  spinner: 'crescent',

  tabbarHighlight: true,
  tabbarPlacement: 'top',

  tabSubPages: true,
});


// Windows Mode Settings
Config.setModeConfig('wp', {
  activator: 'highlight',

  actionSheetEnter: 'action-sheet-wp-slide-in',
  actionSheetLeave: 'action-sheet-wp-slide-out',

  alertEnter: 'alert-wp-pop-in',
  alertLeave: 'alert-wp-pop-out',

  backButtonText: '',
  backButtonIcon: 'ios-arrow-back',

  iconMode: 'ios',

  loadingEnter: 'loading-wp-pop-in',
  loadingLeave: 'loading-wp-pop-out',

  menuType: 'overlay',

  modalEnter: 'modal-md-slide-in',
  modalLeave: 'modal-md-slide-out',

  pageTransition: 'wp-transition',
  pageTransitionDelay: 96,

  spinner: 'circles',

  tabbarPlacement: 'top',

  tabSubPages: true,
});
