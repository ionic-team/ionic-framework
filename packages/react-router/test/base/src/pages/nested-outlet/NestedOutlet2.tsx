import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonRouterOutlet,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import React from 'react';
import { Navigate, Route, useParams } from 'react-router-dom';

const ListPage: React.FC = () => {
  return (
    <IonRouterOutlet ionPage id="listpage">
      <Route path="/nested-outlet2/list" element={<List />} />
      <Route path="/nested-outlet2/list/:id" element={<Item />} />
    </IonRouterOutlet>
  );
};

const List: React.FC = () => {
  return (
    <IonPage data-pageid="list">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref={'/nested-outlet2/home'} text={'Home'} />
          </IonButtons>
          <IonTitle>List</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem detail routerLink="/nested-outlet2/list/1">
            Item #1
          </IonItem>
          <IonItem detail routerLink="/nested-outlet2/list/2">
            Item #2
          </IonItem>
          <IonItem detail routerLink="/nested-outlet2/list/3">
            Item #3
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

const Item: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <IonPage data-pageid="item">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>Item</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>Detail of item #{id}</IonContent>
    </IonPage>
  );
};

const HomePage: React.FC = () => {
  return (
    <IonRouterOutlet ionPage id="homepage">
      <Route path="/nested-outlet2/home" element={<Home />} />
      <Route path="/nested-outlet2/home/welcome" element={<Welcome />} />
    </IonRouterOutlet>
  );
};

const Welcome: React.FC = () => {
  return (
    <IonPage data-pageid="welcome">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Welcome</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem routerLink="/nested-outlet2/list" detail>
            <IonLabel>Go to list from Welcome</IonLabel>
          </IonItem>
          <IonItem routerLink="/nested-outlet2/list/1" detail>
            <IonLabel>Go to first item</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

const Home: React.FC = () => {
  return (
    <IonPage data-pageid="home">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem routerLink="/nested-outlet2/home/welcome" target="_blank" detail>
            <IonLabel>Go to Welcome</IonLabel>
          </IonItem>
          <IonItem routerLink="/nested-outlet2/list" detail>
            <IonLabel>Go to list from Home</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

const NestedOutlet2: React.FC = () => (
  <IonRouterOutlet id="main">
    <Route path="/nested-outlet2/list/*" element={<ListPage />} />
    <Route path="/nested-outlet2/home/*" element={<HomePage />} />
    <Route
      path="/nested-outlet2"
      element={<Navigate to="/nested-outlet2/home" replace />}
    />
  </IonRouterOutlet>
);

export default NestedOutlet2;
