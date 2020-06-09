```tsx
import React from 'react';
import { IonButton, IonContent, IonItem, IonLabel, IonList, IonListHeader } from '@ionic/react';

export const ListHeaderExample: React.FC = () => (
  <IonContent>
    {/*-- Default List Header --*/}
    <IonListHeader>
      <IonLabel>List Header</IonLabel>
    </IonListHeader>

    {/*-- List Header with Button --*/}
    <IonListHeader>
      <IonLabel>New This Week</IonLabel>
      <IonButton>See All</IonButton>
    </IonListHeader>

    {/*-- List Header with Outline Button --*/}
    <IonListHeader>
      <IonLabel>New This Week</IonLabel>
      <IonButton fill="outline">See All</IonButton>
    </IonListHeader>

    {/*-- List Header Full Lines --*/}
    <IonListHeader lines="full">
      <IonLabel>New This Week</IonLabel>
      <IonButton>See All</IonButton>
    </IonListHeader>

    {/*-- List Header Inset Lines --*/}
    <IonListHeader lines="inset">
      <IonLabel>New This Week</IonLabel>
      <IonButton>See All</IonButton>
    </IonListHeader>

    {/*-- List Headers in Lists --*/}
    <IonList>
      <IonListHeader lines="inset">
        <IonLabel>Recent</IonLabel>
        <IonButton>Clear</IonButton>
      </IonListHeader>
      <IonItem lines="none">
        <IonLabel color="primary">
          <h1>I got you babe</h1>
        </IonLabel>
      </IonItem>
    </IonList>

    <IonList>
      <IonListHeader lines="inset">
        <IonLabel>Trending</IonLabel>
      </IonListHeader>
      <IonItem>
        <IonLabel color="primary">
          <h1>harry styles</h1>
        </IonLabel>
      </IonItem>
      <IonItem>
        <IonLabel color="primary">
          <h1>christmas</h1>
        </IonLabel>
      </IonItem>
      <IonItem lines="none">
        <IonLabel color="primary">
          <h1>falling</h1>
        </IonLabel>
      </IonItem>
    </IonList>
  </IonContent>
);
```
