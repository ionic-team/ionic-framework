import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  useIonViewWillEnter,
} from '@ionic/react';
import React, { useEffect } from 'react';

const Favorites: React.FC = () => {
  useIonViewWillEnter(() => {
    console.log('IVWE on Favorites');
  });

  useEffect(() => {
    console.log('Favorites mount');
    return () => console.log('Favorites unmount');
  }, []);
  return (
    <IonPage data-pageid="favorites-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Favorites</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent></IonContent>
    </IonPage>
  );
};

export default Favorites;
