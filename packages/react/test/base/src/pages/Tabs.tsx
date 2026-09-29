import React from 'react';
import { IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, IonPage } from '@ionic/react';
import { Route, Navigate } from 'react-router';

interface TabsProps {}

const Tabs: React.FC<TabsProps> = () => {
  return (
    <IonPage>
      <IonTabs>
        <IonRouterOutlet>
          <Route index element={<Navigate to="/tabs/tab1" replace />} />
          <Route path="tab1" element={<IonLabel>Tab 1</IonLabel>} />
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="tab1" onClick={() => window.alert('Tab was clicked')}>
            <IonLabel>Click Handler</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonPage>
  );
};

export default Tabs;
