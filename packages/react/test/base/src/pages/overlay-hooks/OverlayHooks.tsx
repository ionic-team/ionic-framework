import React from 'react';
import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react';
import { Route, Redirect } from 'react-router-dom';
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

const OverlayHooks: React.FC = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route path="/overlay-hooks" render={() => <Redirect to="/overlay-hooks/actionsheet" />} exact={true} />
        <Route path="/overlay-hooks/actionsheet" component={ActionSheetHook} exact={true} />
        <Route path="/overlay-hooks/alert" component={AlertHook} exact={true} />
        <Route path="/overlay-hooks/loading" component={LoadingHook} exact={true} />
        <Route path="/overlay-hooks/modal" component={ModalHook} exact={true} />
        <Route path="/overlay-hooks/picker" component={PickerHook} exact={true} />
        <Route path="/overlay-hooks/popover" component={PopoverHook} exact={true} />
        <Route path="/overlay-hooks/toast" component={ToastHook} exact={true} />
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
