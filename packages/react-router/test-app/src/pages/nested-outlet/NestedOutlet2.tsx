import React from 'react';
import { Redirect, Route, RouteComponentProps } from 'react-router-dom';
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

const ListPage: React.FC<RouteComponentProps> = ({ match }) => {
  return (
    <IonRouterOutlet ionPage id="listpage">
      <Route exact path="/nested-outlet2/list" component={List} />
      <Route path={`${match.url}/:id`} component={Item} />
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

const Item: React.FC<RouteComponentProps<{ id: string }>> = ({ match }) => {
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
      <IonContent>Detail of item #{match.params.id}</IonContent>
    </IonPage>
  );
};

const HomePage: React.FC<RouteComponentProps> = ({ match }) => {
  return (
    <IonRouterOutlet ionPage id="homepage">
      <Route exact path="/nested-outlet2/home" component={Home} />
      <Route path="/nested-outlet2/home/welcome" component={Welcome} />
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

const Home: React.FC<RouteComponentProps<{ id: string }>> = ({ match }) => {
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
    <Route path="/nested-outlet2/list" component={ListPage} />
    <Route path="/nested-outlet2/home" component={HomePage} />
    <Route
      path="/nested-outlet2"
      render={() => <Redirect to="/nested-outlet2/home" />}
      exact={true}
    />
  </IonRouterOutlet>
);

export default NestedOutlet2;
