import { IonContent, IonHeader, IonIcon, IonLabel, IonPage, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, IonTitle, IonToolbar } from '@ionic/react';
import { homeOutline, radioOutline, libraryOutline, searchOutline } from 'ionicons/icons';
import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const HomePage: React.FC = () => (
  <IonPage>
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

const RadioPage: React.FC = () => (
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Radio</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <div data-testid="radio-content">Radio Content</div>
    </IonContent>
  </IonPage>
);

const LibraryPage: React.FC = () => (
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Library</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <div data-testid="library-content">Library Content</div>
    </IonContent>
  </IonPage>
);

const SearchPage: React.FC = () => (
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Search</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <div data-testid="search-content">Search Content</div>
    </IonContent>
  </IonPage>
);

const TabsDirectNavigation: React.FC = () => {
  return (
    <IonTabs data-testid="tabs-direct-navigation">
      <IonRouterOutlet>
        <Redirect exact path="/tabs-direct-navigation" to="/tabs-direct-navigation/home" />
        <Route path="/tabs-direct-navigation/home" render={() => <HomePage />} exact={true} />
        <Route path="/tabs-direct-navigation/radio" render={() => <RadioPage />} exact={true} />
        <Route path="/tabs-direct-navigation/library" render={() => <LibraryPage />} exact={true} />
        <Route path="/tabs-direct-navigation/search" render={() => <SearchPage />} exact={true} />
      </IonRouterOutlet>

      <IonTabBar slot="bottom" data-testid="tab-bar">
        <IonTabButton tab="home" href="/tabs-direct-navigation/home" data-testid="home-tab">
          <IonIcon icon={homeOutline}></IonIcon>
          <IonLabel>Home</IonLabel>
        </IonTabButton>

        <IonTabButton tab="radio" href="/tabs-direct-navigation/radio" data-testid="radio-tab">
          <IonIcon icon={radioOutline}></IonIcon>
          <IonLabel>Radio</IonLabel>
        </IonTabButton>

        <IonTabButton tab="library" href="/tabs-direct-navigation/library" data-testid="library-tab">
          <IonIcon icon={libraryOutline}></IonIcon>
          <IonLabel>Library</IonLabel>
        </IonTabButton>

        <IonTabButton tab="search" href="/tabs-direct-navigation/search" data-testid="search-tab">
          <IonIcon icon={searchOutline}></IonIcon>
          <IonLabel>Search</IonLabel>
        </IonTabButton>
        </IonTabBar>
      </IonTabs>
  );
};

export default TabsDirectNavigation;
