import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton } from '@ionic/react';

interface TopPageProps {
}

const TopPage: React.FC<TopPageProps> = () => {
  return (
    <IonPage data-pageid="toppage">
      <IonHeader>
        <IonToolbar>
          <IonTitle>TopPage</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonButton routerLink="/otherpage">
          Go to Other Page
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default TopPage;