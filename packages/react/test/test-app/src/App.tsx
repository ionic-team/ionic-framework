import { IonApp, IonContent, IonHeader, IonItem, IonLabel, IonList, IonTitle, IonToolbar } from '@ionic/react';
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
            <IonLabel>
              Test something
            </IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonApp>
  );
};

export default App;
