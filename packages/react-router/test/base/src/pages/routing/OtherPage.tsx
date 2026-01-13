import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  useIonViewWillEnter,
  IonButton,
} from '@ionic/react';
import React, { useEffect } from 'react';

const OtherPage: React.FC = () => {
  useIonViewWillEnter(() => {
    console.log('IVWE on otherpage');
  });

  useEffect(() => {
    console.log('Other Page mount');
    return () => console.log('Other Page unmount');
  }, []);

  return (
    <IonPage data-pageid="other-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>OtherPage</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonButton routerLink="/routing/tabs/tab3">Go to tab3</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default OtherPage;
