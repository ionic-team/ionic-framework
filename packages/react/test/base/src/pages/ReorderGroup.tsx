import React from 'react';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonPage,
  IonReorder,
  IonReorderGroup,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import type { ReorderEndCustomEvent } from '@ionic/react';

const ReorderGroup: React.FC = () => {
  const onReorderEnd = (event: ReorderEndCustomEvent) => {
    if (event.detail.from !== event.detail.to) {
      console.log('ionReorderEnd: Dragged from index', event.detail.from, 'to', event.detail.to);
    } else {
      console.log('ionReorderEnd: No position change occurred');
    }

    event.detail.complete();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton></IonBackButton>
          </IonButtons>
          <IonTitle>Reorder Group</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonReorderGroup disabled={false} onIonReorderEnd={onReorderEnd}>
          <IonItem>
            <IonReorder slot="end"></IonReorder>
            <IonLabel>Item 1</IonLabel>
          </IonItem>
          <IonItem>
            <IonReorder slot="end"></IonReorder>
            <IonLabel>Item 2</IonLabel>
          </IonItem>
          <IonItem>
            <IonReorder slot="end"></IonReorder>
            <IonLabel>Item 3</IonLabel>
          </IonItem>
        </IonReorderGroup>
      </IonContent>
    </IonPage>
  );
};

export default ReorderGroup;
