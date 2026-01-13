import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonButtons,
  IonMenuButton,
  IonButton,
} from '@ionic/react';
import React, { useEffect } from 'react';
import './Tab2.css';
import { useNavigate } from 'react-router-dom';

const Tab2: React.FC = () => {
  const navigate = useNavigate();

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
          <IonItem routerLink="/routing/tabs/settings/details/1">
            <IonLabel>Settings Details 1</IonLabel>
          </IonItem>
          <IonItem routerLink="/routing/tabs/settings/details/2">
            <IonLabel>Settings Details 2</IonLabel>
          </IonItem>
        </IonList>
        <br />
        <br />
        <IonButton
          onClick={() => {
            navigate('/routing/tabs/settings/details/1');
          }}
        >
          Details via navigate
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
