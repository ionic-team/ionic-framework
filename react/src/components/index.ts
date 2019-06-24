
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

// Routing
export { IonRouterOutlet } from './navigation/routing/IonRouterOutlet';
export { IonReactRouterWrapped as IonReactRouter } from './navigation/routing/ReactRouter/IonReactRouter';

// Ionic Context
export { IonicContext } from './utils/IonicContext';
export { useIonicConfig } from './utils/utilHooks';

defineCustomElements(window);
