
import { defineCustomElements } from '@ionic/core/loader';
import { addIcons } from 'ionicons';
import { arrowBackSharp, caretBackSharp, chevronBack, chevronForward, closeCircle, closeSharp, menuOutline, menuSharp, reorderThreeOutline, reorderTwoSharp, searchOutline, searchSharp } from 'ionicons/icons';
export { AlertButton, AlertInput, setupConfig } from '@ionic/core';
export * from './proxies';

// createControllerComponent
export { IonAlert } from './IonAlert';
export { IonLoading } from './IonLoading';
export { IonToast } from './IonToast';
export { IonPicker } from './IonPicker';

// createOverlayComponent
export { IonActionSheet } from './IonActionSheet';
export { IonModal } from './IonModal';
export { IonPopover } from './IonPopover';

// Custom Components
export { IonPage } from './IonPage';
export { IonTabs } from './navigation/IonTabs';
export { IonTabBar } from './navigation/IonTabBar';
export { IonBackButton } from './navigation/IonBackButton';
export { IonRouterOutlet } from './IonRouterOutlet';
export { IonIcon } from './IonIcon';

// Utils
export { isPlatform, getPlatforms, getConfig } from './utils';
export { RouterDirection } from './hrefprops';

// Ionic Animations
export { CreateAnimation } from './CreateAnimation';

// Icons that are used by internal components
addIcons({
  'arrow-back-sharp': arrowBackSharp,
  'caret-back-sharp': caretBackSharp,
  'chevron-back': chevronBack,
  'chevron-forward': chevronForward,
  'close-circle': closeCircle,
  'close-sharp': closeSharp,
  'menu-outline': menuOutline,
  'menu-sharp': menuSharp,
  'reorder-two-sharp': reorderTwoSharp,
  'reorder-three-outline': reorderThreeOutline,
  'search-outline': searchOutline,
  'search-sharp': searchSharp,
});

// TODO: defineCustomElements() is asyncronous
// We need to use the promise
defineCustomElements(window);
