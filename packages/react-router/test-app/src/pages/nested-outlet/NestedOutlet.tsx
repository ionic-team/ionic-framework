import { IonButton, IonContent, IonHeader, IonPage, IonRouterOutlet, IonTitle, IonToolbar } from '@ionic/react';
import { useEffect } from 'react';
import React from 'react';
import { Route } from 'react-router';

const Page: React.FC = () => {
  useEffect(() => {
    console.log('mount MySubPage');
    return () => {
      console.log('unmount MySubPage');
    };
  }, []);
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>My Page</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonButton routerLink="/nested-outlet" routerDirection="root">Back with direction "root"</IonButton>
        <IonButton routerLink="/nested-outlet" routerDirection="back">Back with direction "back"</IonButton>
      </IonContent>
    </IonPage>
  );
};


const OutletPage: React.FC = () => {
  useEffect(() => {
    console.log('mount OutletPage');
    return () => {
      console.log('unmount OutletPage'); // Never called.
    };
  }, []);
  return (
    <IonRouterOutlet ionPage>
      <Route path="/nested-outlet/OutletPage/page" component={Page} exact={true} />
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
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>FirstPage</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonButton routerLink="/nested-outlet/OutletPage/page" routerDirection="forward">Go to my Subpage</IonButton>
      </IonContent>
    </IonPage>
  );
};


const NestedOutlet: React.FC = () => (
  <IonRouterOutlet>
    <Route path="/nested-outlet" component={FirstPage} exact={true} />
    <Route path="/nested-outlet/OutletPage" component={OutletPage} />
  </IonRouterOutlet>
);

export default NestedOutlet;
