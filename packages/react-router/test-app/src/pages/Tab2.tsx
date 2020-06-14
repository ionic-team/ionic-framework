import React, { useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonButtons, IonMenuButton } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab2.css';

const Tab2: React.FC = () => {

  useEffect(() => {
    console.log('Settings mount');
    return () => console.log('Settings unmount');
  }, []);


  return (
    <IonPage data-pageid="settings-page">
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
      <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Settings</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
          <IonItem routerLink='/tabs/settings/details/1'>
            <IonLabel>Settings Details 1</IonLabel>
          </IonItem>
          <IonItem routerLink='/tabs/settings/details/2'>
            <IonLabel>Settings Details 2</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
