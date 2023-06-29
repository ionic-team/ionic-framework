import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react';
import { addCircleOutline, alarm, alertCircle, logoGoogle, logoIonic, newspaper, star } from 'ionicons/icons';
import React from 'react';
import { Route, Navigate, Routes } from 'react-router';

import ActionSheetHook from './ActionSheetHook';
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
        <Routes>
          <Route path="/overlay-hooks/actionsheet" element={<ActionSheetHook />} />
          <Route path="/overlay-hooks/alert" element={<AlertHook />} />
          <Route path="/overlay-hooks/loading" element={<LoadingHook />} />
          <Route path="/overlay-hooks/modal" element={<ModalHook />} />
          <Route path="/overlay-hooks/picker" element={<PickerHook />} />
          <Route path="/overlay-hooks/popover" element={<PopoverHook />} />
          <Route path="/overlay-hooks/toast" element={<ToastHook />} />
          <Route path="/overlay-hooks/*" element={<Navigate to="/overlay-hooks/actionsheet" />} />
        </Routes>
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
