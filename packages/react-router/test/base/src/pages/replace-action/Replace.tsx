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
import { useNavigate } from 'react-router-dom';

const ReplaceAction: React.FC = () => null;

const Page1: React.FC = () => (
  <IonPage data-pageid="page1">
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonBackButton />
        </IonButtons>
        <IonTitle>Page one</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <IonButton id="go-to-page2" routerLink={'/replace-action/page2'}>Goto Page2</IonButton>
    </IonContent>
  </IonPage>
);

const Page2: React.FC = () => {
  const navigate = useNavigate();

  const clickButton = () => {
    navigate('/replace-action/page3', { replace: true });
  };

  return (
    <IonPage data-pageid="page2">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>Page two</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonButton id="go-to-page3" onClick={() => clickButton()}>Goto Page3</IonButton>
      </IonContent>
    </IonPage>
  );
};

const Page3: React.FC = () => {
  const ionRouter = useIonRouter();

  return (
    <IonPage data-pageid="page3">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/replace-action/page1" />
          </IonButtons>
          <IonTitle>Page three</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <p>Page 3</p>
        <p>Note: The back button navigates to Page 1 (not Page 2) because Page 2 used replace navigation.</p>
        {/* Exercises the replace action path through Ionic's handleNavigate() to
            reproduce the scenario fixed in issue #30086. */}
        <IonButton id="replace-to-page1" onClick={() => ionRouter.push('/replace-action/page1', 'none', 'replace')}>
          Replace to Page1
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default ReplaceAction;
export { Page1, Page2, Page3 };
