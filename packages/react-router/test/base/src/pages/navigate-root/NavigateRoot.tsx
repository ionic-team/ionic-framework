import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonButtons,
  IonBackButton,
  useIonRouter,
} from '@ionic/react';
import React from 'react';

export const NavigateRootPageA: React.FC = () => {
  const ionRouter = useIonRouter();

  return (
    <IonPage data-pageid="navigate-root-page-a">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>Page A</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <p id="page-a-can-go-back">{ionRouter.canGoBack() ? 'yes' : 'no'}</p>
        <IonButton id="go-to-page-b" routerLink="/navigate-root/page-b">
          Go to Page B
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export const NavigateRootPageB: React.FC = () => (
  <IonPage data-pageid="navigate-root-page-b">
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonBackButton />
        </IonButtons>
        <IonTitle>Page B</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <IonButton id="go-to-page-c" routerLink="/navigate-root/page-c">
        Go to Page C
      </IonButton>
    </IonContent>
  </IonPage>
);

export const NavigateRootPageC: React.FC = () => {
  const ionRouter = useIonRouter();

  return (
    <IonPage data-pageid="navigate-root-page-c">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>Page C</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <p id="page-c-can-go-back">{ionRouter.canGoBack() ? 'yes' : 'no'}</p>
        <IonButton id="navigate-root-to-page-a" onClick={() => ionRouter.navigateRoot('/navigate-root/page-a')}>
          Navigate Root to Page A
        </IonButton>
      </IonContent>
    </IonPage>
  );
};
