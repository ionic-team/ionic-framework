import React from 'react';
import { IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react';
import { Route, Redirect } from 'react-router';

interface TabsProps {}

const Tabs: React.FC<TabsProps> = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Redirect from="/tabs" to="/tabs/tab1" exact />
        <Route path="/tabs/tab1" render={() => <IonLabel>Tab 1</IonLabel>} />
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
