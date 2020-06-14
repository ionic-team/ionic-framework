import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';

interface MultipleTabsProps {
}

const MultipleTabs: React.FC<MultipleTabsProps> = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>MultipleTabs</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        
      </IonContent>
    </IonPage>
  );
};

export default MultipleTabs;