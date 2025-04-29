import React from 'react';
import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react';
import { Route, Redirect } from 'react-router-dom';
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
import PickerComponent from './PickerComponent';
import PopoverComponent from './PopoverComponent';
import ToastComponent from './ToastComponent';

const OverlayComponents: React.FC = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route path="/overlay-components" render={() => <Redirect to="/overlay-components/actionsheet" />} exact={true} />
        <Route path="/overlay-components/actionsheet" component={ActionSheetComponent} exact={true} />
        <Route path="/overlay-components/alert" component={AlertComponent} exact={true} />
        <Route path="/overlay-components/loading" component={LoadingComponent} exact={true} />
        <Route path="/overlay-components/modal" component={ModalComponent} exact={true} />
        <Route path="/overlay-components/picker" component={PickerComponent} exact={true} />
        <Route path="/overlay-components/popover" component={PopoverComponent} exact={true} />
        <Route path="/overlay-components/toast" component={ToastComponent} exact={true} />
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

export default OverlayComponents;
