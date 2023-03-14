import React, { useContext } from 'react';
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
  IonMenuButton,
  IonTitle,
  IonContent,
  IonTabsContext,
  IonButton,
} from '@ionic/react';
import { Route, Redirect } from 'react-router';
import { triangle, square } from 'ionicons/icons';

interface TabsContextProps {}

const TabsContext: React.FC<TabsContextProps> = () => {
  return (
    <IonTabs>
      <IonRouterOutlet id="tabs">
        <Route path="/tab-context/tab1" component={Tab1} exact />
        <Route path="/tab-context/tab2" component={Tab2} exact />
        <Redirect from="/tab-context" to="/tab-context/tab1" exact />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="tab1" href="/tab-context/tab1" routerOptions={{ unmount: true }}>
          <IonIcon icon={triangle} />
          <IonLabel>Tab1</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab2" href="/tab-context/tab2">
          <IonIcon icon={square} />
          <IonLabel>Tab2</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

const Tab1 = () => {
  const tabContext = useContext(IonTabsContext);

  return (
    <IonPage id="home" data-pageid="tab1">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Tab1</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div>Page: {tabContext.activeTab}</div>
        <IonButton onClick={() => tabContext.selectTab('tab2')}>Go to tab2</IonButton>
      </IonContent>
    </IonPage>
  );
};

const Tab2 = () => {
  const tabContext = useContext(IonTabsContext);

  return (
    <IonPage id="home" data-pageid="tab2">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Tab2</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div>Page: {tabContext.activeTab}</div>
        <IonButton onClick={() => tabContext.selectTab('tab1')}>Go to tab1</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default TabsContext;
