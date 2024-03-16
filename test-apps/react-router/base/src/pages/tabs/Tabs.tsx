import React from 'react';
import {
  IonTabs,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonButton,
} from '@ionic/react';
import { Route, Redirect } from 'react-router';
import { triangle, square } from 'ionicons/icons';

interface TabsProps {}

const Tabs: React.FC<TabsProps> = () => {
  return (
    <IonTabs data-pageid="tabs">
      <IonRouterOutlet id="tabs">
        <Route path="/tabs/tab1" component={Tab1} exact />
        <Route path="/tabs/tab2" component={Tab2} exact />
        <Route path="/tabs/tab1/child" component={Tab1Child1} exact />
        <Route path="/tabs/tab1/child2" component={Tab1Child2} exact />
        <Redirect from="/tabs" to="/tabs/tab1" exact />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="tab1" href="/tabs/tab1">
          <IonIcon icon={triangle} />
          <IonLabel>Tab1</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab2" href="/tabs/tab2">
          <IonIcon icon={square} />
          <IonLabel>Tab2</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

const Tab1 = () => {
  return (
    <IonPage data-pageid="tab1">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab1</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonButton routerLink="/tabs/tab1/child" id="child-one">Go to Tab1Child1</IonButton>
        <IonButton routerLink="/tabs-secondary/tab1" id="tabs-secondary">Go to Secondary Tabs</IonButton>
      </IonContent>
    </IonPage>
  );
};

const Tab1Child1 = () => {
  return (
    <IonPage data-pageid="tab1child1">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>Tab1</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        Tab 1 Child 1
        <IonButton routerLink="/tabs/tab1/child2" id="child-two">Go to Tab1Child2</IonButton>
      </IonContent>
    </IonPage>
  );
};

const Tab1Child2 = () => {
  return (
    <IonPage data-pageid="tab1child2">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>Tab1</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        Tab 1 Child 2
      </IonContent>
    </IonPage>
  );
};

const Tab2 = () => {
  return (
    <IonPage data-pageid="tab2">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab2</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        Tab 2
      </IonContent>
    </IonPage>
  );
};

export default Tabs;
