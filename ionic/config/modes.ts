
import {IonicConfig} from './config';


// iOS Mode Settings
IonicConfig.modeConfig('ios', {

  actionMenuEnter: 'action-menu-slide-in',
  actionMenuLeave: 'action-menu-slide-out',
  actionMenuCancelIcon: 'ion-close',
  actionMenuDestructiveIcon: 'ion-trash-a',

  backButtonText: 'Back',
  backButtonIcon: 'ion-ios-arrow-back',

  iconForward: 'ion-ios-arrow-forward',
  iconMode: 'ios',

  keyboardScrollAssist: true,
  tapPolyfill: false,

  navTitleAlign: 'center',
  tabBarPlacement: 'bottom',
  viewTransition: 'ios',

});


// Material Design Mode Settings
IonicConfig.modeConfig('md', {

  actionMenuEnter: 'action-menu-md-slide-in',
  actionMenuLeave: 'action-menu-md-slide-out',
  actionMenuCancelIcon: 'ion-close',
  actionMenuDestructiveIcon: 'ion-trash-a',

  backButtonText: '',
  backButtonIcon: 'ion-android-arrow-back',

  iconForward: '',
  iconMode: 'md',

  keyboardScrollAssist: true,
  tapPolyfill: false,

  navTitleAlign: 'left',
  tabBarPlacement: 'top',
  viewTransition: 'md'

  type: 'overlay',
  mdRipple: true,
});
