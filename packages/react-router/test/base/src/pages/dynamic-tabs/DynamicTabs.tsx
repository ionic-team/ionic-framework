import React, { useState, useCallback } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonTabs,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonButton,
} from '@ionic/react';
import { Route, Navigate } from 'react-router';
import { triangle, square } from 'ionicons/icons';

const DynamicTabs: React.FC = () => {
  const [display2ndTab, setDisplayThirdTab] = useState<boolean>(false);

  return (
    <IonTabs>
      <IonRouterOutlet id="dynamic-tabs">
        <Route path="/dynamic-tabs/tab1" element={<Tab1 setDisplayThirdTab={setDisplayThirdTab} />} />
        <Route
          path="/dynamic-tabs/tab2"
          element={display2ndTab ? <Tab2 /> : <Navigate to="/dynamic-tabs/tab1" replace />}
        />
        <Route path="/dynamic-tabs" element={<Navigate to="/dynamic-tabs/tab1" replace />} />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="tab1" href="/dynamic-tabs/tab1">
          <IonIcon icon={triangle} />
          <IonLabel>Tab 1</IonLabel>
        </IonTabButton>
        {display2ndTab && (
          <IonTabButton tab="tab2" href="/dynamic-tabs/tab2">
            <IonIcon icon={square} />
            <IonLabel>Tab 2</IonLabel>
          </IonTabButton>
        )}
      </IonTabBar>
    </IonTabs>
  );
};

export default DynamicTabs;

const Tab1: React.FC<{
  setDisplayThirdTab: (value: boolean) => void;
}> = ({ setDisplayThirdTab }) => {
  const doIt = useCallback(() => {
    setDisplayThirdTab(true);
  }, [setDisplayThirdTab]);

  return (
    <IonPage data-pageid="Tab1">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 1</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div>Tab 1 Page</div>
        <IonButton onClick={doIt}>Add Tab 2</IonButton>
      </IonContent>
    </IonPage>
  );
};

const Tab2 = () => {
  return (
    <IonPage data-pageid="Tab2">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 2</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div>Tab 2 Page</div>
      </IonContent>
    </IonPage>
  );
};
