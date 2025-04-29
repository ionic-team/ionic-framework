import React from 'react';
import { IonLabel, IonTabBar, IonTabButton, IonTabs, IonRouterOutlet, IonPage, IonContent } from '@ionic/react';
import { Route, Redirect } from 'react-router';

interface TabsProps {}

const Tab1: React.FC = () => {
  return (
    <IonPage>
      <IonContent>
        <IonLabel>Tab 1 Content</IonLabel>
      </IonContent>
    </IonPage>
  );
};

const Tab2: React.FC = () => {
  return (
    <IonPage>
      <IonContent>
        <IonLabel>Tab 2 Content</IonLabel>
      </IonContent>
    </IonPage>
  );
};

const TabsBasic: React.FC<TabsProps> = () => {
  const onTabWillChange = (event: CustomEvent) => {
    console.log('onIonTabsWillChange', event.detail.tab);
  };

  const onTabDidChange = (event: CustomEvent) => {
    console.log('onIonTabsDidChange:', event.detail.tab);
  };

  return (
    <IonTabs onIonTabsWillChange={onTabWillChange} onIonTabsDidChange={onTabDidChange}>
      <IonRouterOutlet>
        <Redirect exact path="/tabs-basic" to="/tabs-basic/tab1" />
        <Route exact path="/tabs-basic/tab1" component={Tab1} />
        <Route exact path="/tabs-basic/tab2" component={Tab2} />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="tab1" href="/tabs-basic/tab1">
          <IonLabel>Tab 1</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab2" href="/tabs-basic/tab2">
          <IonLabel>Tab 2</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default TabsBasic;
