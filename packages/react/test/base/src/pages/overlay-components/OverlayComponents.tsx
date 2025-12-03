import React from 'react';
import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react';
import { Route, Navigate } from 'react-router';
import {
  addCircleOutline,
  alarm,
  alertCircle,
  logoGoogle,
  logoIonic,
  newspaper,
  star,
} from 'ionicons/icons';
import ActionSheetComponent from './ActionSheetComponent';
import AlertComponent from './AlertComponent';
import LoadingComponent from './LoadingComponent';
import ModalComponent from './ModalComponent';
import ModalFocusTrap from './ModalFocusTrap';
import ModalTeleport from './ModalTeleport';
import PickerComponent from './PickerComponent';
import PopoverComponent from './PopoverComponent';
import ToastComponent from './ToastComponent';

interface OverlayHooksProps {}

const OverlayHooks: React.FC<OverlayHooksProps> = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route index element={<Navigate to="/overlay-components/actionsheet" replace />} />
        <Route path="actionsheet" element={<ActionSheetComponent />} />
        <Route path="alert" element={<AlertComponent />} />
        <Route path="loading" element={<LoadingComponent />} />
        <Route path="modal-basic" element={<ModalComponent />} />
        <Route path="modal-focus-trap" element={<ModalFocusTrap />} />
        <Route path="modal-teleport" element={<ModalTeleport />} />
        <Route path="picker" element={<PickerComponent />} />
        <Route path="popover" element={<PopoverComponent />} />
        <Route path="toast" element={<ToastComponent />} />
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
        <IonTabButton tab="modal" href="/overlay-components/modal-basic">
          <IonIcon icon={star} />
          <IonLabel>Modal</IonLabel>
        </IonTabButton>
        <IonTabButton tab="modalFocus" href="/overlay-components/modal-focus-trap">
          <IonIcon icon={star} />
          <IonLabel>Modal Focus</IonLabel>
        </IonTabButton>
        <IonTabButton tab="modalTeleport" href="/overlay-components/modal-teleport">
          <IonIcon icon={star} />
          <IonLabel>Modal Teleport</IonLabel>
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
