import { IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react';
import React from 'react';
import { Route, Navigate } from 'react-router';

interface TabsProps {}

const Tabs: React.FC<TabsProps> = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route path="/tabs/tab1">
          <IonLabel>Tab 1</IonLabel>
        </Route>
        <Route path="/tabs" element={<Navigate to="/tabs/tab1" />} />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="tab1" onClick={() => window.alert('Tab was clicked')}>
          <IonLabel>Click Handler</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default Tabs;
