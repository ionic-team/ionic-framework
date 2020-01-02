```tsx
import React from 'react';
import {
  IonButtons,
  IonToolbar,
  IonBackButton,
  IonTitle,
  IonButton,
  IonIcon,
  IonMenuButton,
  IonContent
} from '@ionic/react';

export const ButtonsExample: React.FC = () => (
  <IonContent>
    <IonToolbar>
      <IonButtons slot="start">
        <IonBackButton defaultHref="/" />
      </IonButtons>
      <IonTitle>Back Button</IonTitle>
    </IonToolbar>

    <IonToolbar>
      <IonButtons slot="secondary">
        <IonButton>
          <IonIcon slot="icon-only" name="person-circle" />
        </IonButton>
        <IonButton>
          <IonIcon slot="icon-only" name="search" />
        </IonButton>
      </IonButtons>
      <IonTitle>Default Buttons</IonTitle>
      <IonButtons slot="primary">
        <IonButton color="secondary">
          <IonIcon slot="icon-only" ios="ellipsis-horizontal" md="ellipsis-vertical" />
        </IonButton>
      </IonButtons>
    </IonToolbar>

    <IonToolbar>
      <IonButtons slot="primary">
        <IonButton onClick={() => {}}>
          <IonIcon slot="icon-only" name="star" />
        </IonButton>
      </IonButtons>
      <IonTitle>Right side menu toggle</IonTitle>
      <IonButtons slot="end">
        <IonMenuButton autoHide={false} />
      </IonButtons>
    </IonToolbar>

    <IonToolbar>
      <IonButtons collapse="true">
        <IonButton>
          <IonIcon slot="icon-only" name="star" />
        </IonButton>
      </IonButtons>
      <IonTitle>Collapsible Buttons</IonTitle>
    </IonToolbar>
  </IonContent>
);
```