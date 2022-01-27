
import { IonContent, IonHeader, IonLabel, IonPage, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import { Redirect, Route } from 'react-router';

const Tab1: React.FC = () => (
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>
          Tab 1
        </IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent fullscreen>
      <IonLabel>Tab 1 page</IonLabel>
    </IonContent>
  </IonPage>
);

const Tab2: React.FC = () => (
<IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>
          Tab 2
        </IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent fullscreen>
      <IonLabel>Tab 2 page</IonLabel>
    </IonContent>
  </IonPage>
  );

const Tabs: React.FC = () => (
  <IonTabs>
    <IonRouterOutlet>
      <Route exact path="/tabs/tab1">
        <Tab1 />
      </Route>
      <Route exact path="/tabs/tab2">
        <Tab2 />
      </Route>
      <Route exact path="/tabs">
        <Redirect to ="/tabs/tab1" />
      </Route>
    </IonRouterOutlet>
    <IonTabBar slot="bottom">
      <IonTabButton tab="tab1" href="/tabs/tab1">
        <IonLabel>Tab 1</IonLabel>
      </IonTabButton>
      <IonTabButton tab="tab2" href="/tabs/tab2">
        <IonLabel>Tab 2</IonLabel>
      </IonTabButton>
    </IonTabBar>
  </IonTabs>
)

export default Tabs;
