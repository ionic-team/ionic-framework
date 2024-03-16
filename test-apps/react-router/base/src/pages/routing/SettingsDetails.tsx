import React, { useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonLabel,
  IonButton,
} from '@ionic/react';
import { useParams } from 'react-router';

interface DetailsProps {}

const SettingsDetails: React.FC<DetailsProps> = () => {
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    console.log('Settings Details mount');
    return () => console.log('Settings Details unmount');
  }, []);

  const nextId = parseInt(id, 10) + 1;
  // LEFT OFF - why is back button not working for multiple entries?

  return (
    <IonPage data-pageid={`settings-details-page-${id}`}>
      <IonHeader>
        <IonToolbar>
          <IonButtons>
            <IonBackButton defaultHref="/routing/tabs/settings"></IonBackButton>
          </IonButtons>
          <IonTitle>Settings Details</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonLabel data-testid="details-label">Details {id}</IonLabel>
        <br />
        <br />
        <IonButton routerLink={`/routing/tabs/settings/details/${nextId}`}>
          <IonLabel>Go to Settings Details {nextId}</IonLabel>
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default SettingsDetails;
