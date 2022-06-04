import React, { useEffect, useContext } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  useIonViewWillEnter,
  IonButtons,
  IonMenuButton,
  IonButton,
  IonRouterContext,
} from '@ionic/react';
import './Tab1.css';
import { Link } from 'react-router-dom';

const Tab1: React.FC = () => {
  useEffect(() => {
    console.log('Home mount');
    return () => console.log('Home unmount');
  }, []);

  useIonViewWillEnter(() => {
    console.log('IVWE on tab1');
  });

  const ionRouter = useContext(IonRouterContext);

  // const ionRouter = useIonRouter();

  // useIonViewDidEnter(() => {
  //   console.log('IVDE on tab1');
  // })

  // useIonViewWillLeave(() => {
  //   console.log('IVWL tab1')
  // })

  return (
    <IonPage id="home" data-pageid="home-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem routerLink="/routing/tabs/home/details/1">
            <IonLabel>Details 1</IonLabel>
          </IonItem>
          <IonItem routerLink="/routing/tabs/home/details/1" routerOptions={{ unmount: true }}>
            <IonLabel>Details 1 & Unmount</IonLabel>
          </IonItem>
          <IonItem routerLink="/routing/tabs/home/details/1?hello=there">
            <IonLabel>Details 1 with Query Params</IonLabel>
          </IonItem>
          <IonItem routerLink="/routing/tabs/settings/details/1">
            <IonLabel>Details 1 on settings</IonLabel>
          </IonItem>
          <IonItem routerLink="/routing/otherpage">
            <IonLabel>Other Page</IonLabel>
          </IonItem>
        </IonList>
        <Link to="/routing/tabs/home/details/1">Go to details 1 via link</Link>
        <IonButton onClick={() => ionRouter.push('/routing/tabs/home/details/1')}>
          Go to details 1 via IonRouter
        </IonButton>
        <br />
        <br />
        <Link to="/routing/tabs/settings/details/1">Go to details 1 on settings</Link>
        <br />
        <br />
        CanGoBack: {JSON.stringify(ionRouter.canGoBack())}
        <br />
        <br />
        RouteInfo: {JSON.stringify(ionRouter.routeInfo)}
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
