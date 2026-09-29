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
import React from 'react';
import { useParams } from 'react-router-dom';

import TestDescription from '../../components/TestDescription';

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
        <TestDescription>The "Page ID" above should match the URL parameter. Tap "Go to next param" to increment the ID and verify the displayed value updates to match the new URL.</TestDescription>
      </IonContent>
    </IonPage>
  );
};

export default Page;
