
import { defineCustomElements } from '@ionic/core/loader';
export { AlertButton, AlertInput } from '@ionic/core';
export { IonApp } from './IonApp'
export * from './proxies';

// createControllerComponent
export { IonAlert } from './IonAlert';
export { IonLoading } from './IonLoading';
export { IonToast } from './IonToast';

// createOverlayComponent
export { IonActionSheet } from './IonActionSheet';
export { IonModal } from './IonModal';
export { IonPopover } from './IonPopover';

// Custom Components
export { IonPage } from './IonPage';
export { IonTabs } from './navigation/IonTabs';
export { IonTabBar } from './navigation/IonTabBar';
export { IonBackButton } from './navigation/IonBackButton';
export { IonItem } from './IonItem';

// Routing
export { IonRouterOutlet } from './navigation/routing/IonRouterOutlet';
export { IonReactRouter } from './navigation/routing/ReactRouter/IonReactRouter';

// Ionic Context
export { IonicContext } from './utils/IonicContext';
export { useIonicConfig } from './utils/utilHooks';

// Icons
import { addIcons } from 'ionicons';
import { close, reorder, menu, arrowDown, arrowForward, arrowBack, search, closeCircle } from 'ionicons/icons';

defineCustomElements(window);

// Icons that are used by internal components
addIcons({
  'ios-close': close.ios,
  'md-close': close.md,
  'ios-reorder': reorder.ios,
  'md-reorder': reorder.md,
  'ios-menu': menu.ios,
  'md-menu': menu.md,
  'ios-arrow-forward': arrowForward.ios,
  'md-arrow-forward': arrowForward.md,
  'ios-arrow-back': arrowBack.ios,
  'md-arrow-back': arrowBack.md,
  'ios-arrow-down': arrowDown.ios,
  'md-arrow-down': arrowDown.md,
  'ios-search': search.ios,
  'md-search': search.md,
  'ios-close-circle': closeCircle.ios,
  'md-close-circle': closeCircle.md,
});
