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
import { useParams, useLocation } from 'react-router';

interface DetailsProps {}

const Details: React.FC<DetailsProps> = () => {
  const { id } = useParams<{ id: string }>();

  const location = useLocation();

  useEffect(() => {
    console.log('Home Details mount');
    return () => console.log('Home Details unmount');
  }, []);

  const nextId = parseInt(id, 10) + 1;

  return (
    <IonPage data-pageid={`home-details-page-${id}`}>
      <IonHeader>
        <IonToolbar>
          <IonButtons>
            <IonBackButton></IonBackButton>
          </IonButtons>
          <IonTitle>Details</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonLabel data-testid="details-label">Details {id}</IonLabel>
        <br />
        <br />
        {location.search && (
          <>
            <IonLabel data-testid="query-label">Query Params: {location.search}</IonLabel>
            <br />
            <br />
          </>
        )}
        <IonButton routerLink={`/routing/tabs/home/details/${nextId}`}>
          <IonLabel>Go to Details {nextId}</IonLabel>
        </IonButton>
        <br />
        <IonButton routerLink={`/routing/tabs/settings/details/1`}>
          <IonLabel>Go to Settings Details 1</IonLabel>
        </IonButton>
        <br />
        <br />
        <input data-testid="details-input" />
      </IonContent>
    </IonPage>
  );
};

export default Details;
