import { addIcons } from 'ionicons';
import { ICON_PATHS } from 'ionicons/icons';
import { defineCustomElements } from '@ionic/core/loader';
export { AlertButton, AlertInput } from '@ionic/core';
export * from './proxies';

// createControllerComponent
export { default as IonAlert } from './IonAlert';
export { default as IonLoading } from './IonLoading';
export { default as IonToast } from './IonToast';

// createOverlayComponent
export { default as IonActionSheet } from './IonActionSheet';
export { default as IonModal } from './IonModal';
export { default as IonPopover } from './IonPopover';

// Custom Components
export { default as IonPage } from './IonPage';
export { default as IonTabs } from './navigation/IonTabs';
export { default as IonTabBar } from './navigation/IonTabBar';
export { IonRouterOutlet } from './navigation/IonRouterOutlet';
export { IonBackButton } from './navigation/IonBackButton';

addIcons(ICON_PATHS);

// defineCustomElements(window);
export const bootStrapIonic = defineCustomElements;
