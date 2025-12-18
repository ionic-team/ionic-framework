import {
  IonContent,
  IonHeader,
  IonIcon,
  IonLabel,
  IonPage,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { homeOutline, radioOutline, libraryOutline } from 'ionicons/icons';
import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const HomePage: React.FC = () => (
  <IonPage data-testid="home-page">
    <IonHeader>
      <IonToolbar>
        <IonTitle>Home</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <div data-testid="home-content">Home Content</div>
    </IonContent>
  </IonPage>
);

const Home2Page: React.FC = () => (
  <IonPage data-testid="home2-page">
    <IonHeader>
      <IonToolbar>
        <IonTitle>Home 2</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <div data-testid="home2-content">Home 2 Content</div>
    </IonContent>
  </IonPage>
);

const Home3Page: React.FC = () => (
  <IonPage data-testid="home3-page">
    <IonHeader>
      <IonToolbar>
        <IonTitle>Home 3</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <div data-testid="home3-content">Home 3 Content</div>
    </IonContent>
  </IonPage>
);

const TabsSimilarPrefixes: React.FC = () => {
  return (
    <IonTabs data-testid="tabs-similar-prefixes">
      <IonRouterOutlet>
        <Redirect exact path="/tabs-similar-prefixes" to="/tabs-similar-prefixes/home" />
        <Route path="/tabs-similar-prefixes/home" render={() => <HomePage />} exact={true} />
        <Route path="/tabs-similar-prefixes/home2" render={() => <Home2Page />} exact={true} />
        <Route path="/tabs-similar-prefixes/home3" render={() => <Home3Page />} exact={true} />
      </IonRouterOutlet>

      <IonTabBar slot="bottom" data-testid="tab-bar">
        <IonTabButton tab="home" href="/tabs-similar-prefixes/home" data-testid="home-tab">
          <IonIcon icon={homeOutline}></IonIcon>
          <IonLabel>Home</IonLabel>
        </IonTabButton>

        <IonTabButton tab="home2" href="/tabs-similar-prefixes/home2" data-testid="home2-tab">
          <IonIcon icon={radioOutline}></IonIcon>
          <IonLabel>Home 2</IonLabel>
        </IonTabButton>

        <IonTabButton tab="home3" href="/tabs-similar-prefixes/home3" data-testid="home3-tab">
          <IonIcon icon={libraryOutline}></IonIcon>
          <IonLabel>Home 3</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default TabsSimilarPrefixes;
