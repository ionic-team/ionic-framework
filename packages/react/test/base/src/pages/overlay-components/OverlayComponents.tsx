import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react';
import { addCircleOutline, alarm, alertCircle, logoGoogle, logoIonic, newspaper, star } from 'ionicons/icons';
import React from 'react';
import { Route, Routes, Navigate } from 'react-router';

import ActionSheetComponent from './ActionSheetComponent';
import AlertComponent from './AlertComponent';
import LoadingComponent from './LoadingComponent';
import ModalComponent from './ModalComponent';
import PickerComponent from './PickerComponent';
import PopoverComponent from './PopoverComponent';
import ToastComponent from './ToastComponent';

interface OverlayHooksProps {}

const OverlayHooks: React.FC<OverlayHooksProps> = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Routes>
          <Route path="/overlay-components/actionsheet" element={<ActionSheetComponent />} />
          <Route path="/overlay-components/alert" element={<AlertComponent />} />
          <Route path="/overlay-components/loading" element={<LoadingComponent />} />
          <Route path="/overlay-components/modal" element={<ModalComponent />} />
          <Route path="/overlay-components/picker" element={<PickerComponent />} />
          <Route path="/overlay-components/popover" element={<PopoverComponent />} />
          <Route path="/overlay-components/toast" element={<ToastComponent />} />
          <Route path="/overlay-components/*" element={<Navigate to="/overlay-components/actionsheet" />} />
        </Routes>
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="actionsheet" href="/overlay-components/actionsheet">
          <IonIcon icon={newspaper} />
          <IonLabel>ActionSheet</IonLabel>
        </IonTabButton>
        <IonTabButton tab="alert" href="/overlay-components/alert">
          <IonIcon icon={alertCircle} />
          <IonLabel>Alert</IonLabel>
        </IonTabButton>
        <IonTabButton tab="loading" href="/overlay-components/loading">
          <IonIcon icon={addCircleOutline} />
          <IonLabel>Loading</IonLabel>
        </IonTabButton>
        <IonTabButton tab="modal" href="/overlay-components/modal">
          <IonIcon icon={star} />
          <IonLabel>Modal</IonLabel>
        </IonTabButton>
        <IonTabButton tab="picker" href="/overlay-components/picker">
          <IonIcon icon={logoIonic} />
          <IonLabel>Picker</IonLabel>
        </IonTabButton>
        <IonTabButton tab="popover" href="/overlay-components/popover">
          <IonIcon icon={logoGoogle} />
          <IonLabel>Popover</IonLabel>
        </IonTabButton>
        <IonTabButton tab="toast" href="/overlay-components/toast">
          <IonIcon icon={alarm} />
          <IonLabel>Toast</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default OverlayHooks;
