
import {IonicConfig} from './config';


// iOS Mode Settings
IonicConfig.modeConfig('ios', {

  actionMenuEnter: 'action-menu-slide-in',
  actionMenuLeave: 'action-menu-slide-out',
  actionMenuCancelIcon: '',
  actionMenuDestructiveIcon: '',

  backButtonText: 'Back',
  backButtonIcon: 'ion-ios-arrow-back',

  forwardIcon: 'ion-ios-arrow-forward',
  iconMode: 'ios',

  navTitleAlign: 'center',
  tabBarPlacement: 'bottom',
  viewTransition: 'ios',

});


// Material Design Mode Settings
IonicConfig.modeConfig('md', {

  actionMenuEnter: 'action-menu-md-slide-in',
  actionMenuLeave: 'action-menu-md-slide-out',
  actionMenuCancelIcon: 'ion-md-close',
  actionMenuDestructiveIcon: 'ion-md-trash',

  backButtonText: '',
  backButtonIcon: 'ion-md-arrow-back',

  forwardIcon: '',
  iconMode: 'md',

  navTitleAlign: 'left',
  tabBarPlacement: 'top',
  viewTransition: 'md',

  type: 'overlay',
  mdRipple: true,
});
