import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonRouterOutlet,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useEffect } from 'react';
import React from 'react';
import { Route, Redirect } from 'react-router';

const Page: React.FC = () => {
  useEffect(() => {
    console.log('mount MySubPage');
    return () => {
      console.log('unmount MySubPage');
    };
  }, []);
  return (
    <IonPage data-pageid="secondpage">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Second Page</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonButton routerLink="/nested-outlet" routerDirection="root">
          Back with direction "root"
        </IonButton>
        <IonButton routerLink="/nested-outlet" routerDirection="back">
          Back with direction "back"
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

const SecondPage: React.FC = () => {
  useEffect(() => {
    console.log('mount secondpage');
    return () => {
      console.log('unmount secondpage'); // Never called.
    };
  }, []);
  return (
    <IonRouterOutlet ionPage>
      <Route
        path="/nested-outlet/secondpage"
        exact={true}
        render={() => <Redirect to="/nested-outlet/secondpage/page" />}
      />
      <Route path="/nested-outlet/secondpage/page" component={Page} exact={true} />
    </IonRouterOutlet>
  );
};

const FirstPage: React.FC = () => {
  useEffect(() => {
    console.log('mount FirstPage');
    return () => {
      console.log('unmount FirstPage');
    };
  }, []);
  return (
    <IonPage data-pageid="firstpage">
      <IonHeader>
        <IonToolbar>
          <IonTitle>FirstPage</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonButton routerLink="/nested-outlet/secondpage/page" routerDirection="forward">
          Go to second page
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

const NestedOutlet: React.FC = () => (
  <IonRouterOutlet>
    <Route path="/nested-outlet" component={FirstPage} exact={true} />
    <Route path="/nested-outlet/secondpage" component={SecondPage} />
  </IonRouterOutlet>
);

export default NestedOutlet;
