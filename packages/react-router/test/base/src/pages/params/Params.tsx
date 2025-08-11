import React from 'react';
import {
  IonButtons,
  IonBackButton,
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useParams } from 'react-router-dom';

const Page: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const parseID = id ? parseInt(id) : NaN;
  const displayId = id || 'N/A';
  const nextParamLink = !isNaN(parseID) ? `/params/${parseID + 1}` : '/params/1';

  return (
    <IonPage data-pageid={'params-' + displayId }>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Params { displayId }</IonTitle>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonButton id="next-page" routerLink={nextParamLink} >Go to next param</IonButton>
        <br />
        Page ID: { displayId }
      </IonContent>
    </IonPage>
  );
};

export default Page;
