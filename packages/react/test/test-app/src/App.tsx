import {
  IonApp,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { logoIonic } from 'ionicons/icons';
import React from 'react';

const App: React.FC = () => {
  return (
    <IonApp>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Welcome to React</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem button>
            <IonIcon icon={logoIonic} slot="start"></IonIcon>
            <IonLabel>Test something</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonApp>
  );
};

export default App;
