import React from 'react';
import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react';
import { Route, Navigate } from 'react-router';
import ActionSheetHook from './ActionSheetHook';
import {
  addCircleOutline,
  alarm,
  alertCircle,
  logoGoogle,
  logoIonic,
  newspaper,
  star,
} from 'ionicons/icons';
import AlertHook from './AlertHook';
import LoadingHook from './LoadingHook';
import ModalHook from './ModalHook';
import PickerHook from './PickerHook';
import PopoverHook from './PopoverHook';
import ToastHook from './ToastHook';

interface OverlayHooksProps {}

const OverlayHooks: React.FC<OverlayHooksProps> = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route index element={<Navigate to="/overlay-hooks/actionsheet" replace />} />
        <Route path="actionsheet" element={<ActionSheetHook />} />
        <Route path="alert" element={<AlertHook />} />
        <Route path="loading" element={<LoadingHook />} />
        <Route path="modal" element={<ModalHook />} />
        <Route path="picker" element={<PickerHook />} />
        <Route path="popover" element={<PopoverHook />} />
        <Route path="toast" element={<ToastHook />} />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="actionsheet" href="/overlay-hooks/actionsheet">
          <IonIcon icon={newspaper} />
          <IonLabel>ActionSheet</IonLabel>
        </IonTabButton>
        <IonTabButton tab="alert" href="/overlay-hooks/alert">
          <IonIcon icon={alertCircle} />
          <IonLabel>Alert</IonLabel>
        </IonTabButton>
        <IonTabButton tab="loading" href="/overlay-hooks/loading">
          <IonIcon icon={addCircleOutline} />
          <IonLabel>Loading</IonLabel>
        </IonTabButton>
        <IonTabButton tab="modal" href="/overlay-hooks/modal">
          <IonIcon icon={star} />
          <IonLabel>Modal</IonLabel>
        </IonTabButton>
        <IonTabButton tab="picker" href="/overlay-hooks/picker">
          <IonIcon icon={logoIonic} />
          <IonLabel>Picker</IonLabel>
        </IonTabButton>
        <IonTabButton tab="popover" href="/overlay-hooks/popover">
          <IonIcon icon={logoGoogle} />
          <IonLabel>Popover</IonLabel>
        </IonTabButton>
        <IonTabButton tab="toast" href="/overlay-hooks/toast">
          <IonIcon icon={alarm} />
          <IonLabel>Toast</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default OverlayHooks;
