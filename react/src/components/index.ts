
import { defineCustomElements } from '@ionic/core/loader';
export { AlertButton, AlertInput } from '@ionic/core';
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
export { IonRouterOutlet } from './navigation/IonRouterOutlet';
export { IonBackButton } from './navigation/IonBackButton';
export { IonRouterWrapped as IonRouter } from './navigation/IonRouter';

defineCustomElements(window);
