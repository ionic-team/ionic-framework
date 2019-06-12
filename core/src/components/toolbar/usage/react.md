```tsx
import React from 'react';
import {
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon,
  IonMenuButton,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonContent
} from '@ionic/react';

export const ToolbarExample: React.FunctionComponent = () => (
  <IonButton>
    <IonToolbar>
      <IonTitle>Title Only</IonTitle>
    </IonToolbar>

    <IonToolbar>
      <IonButtons slot="start">
        <IonBackButton defaultHref="/" />
      </IonButtons>
      <IonTitle>Back Button</IonTitle>
    </IonToolbar>

    <IonToolbar>
      <IonButtons slot="secondary">
        <IonButton>
          <IonIcon slot="icon-only" name="contact" />
        </IonButton>
        <IonButton>
          <IonIcon slot="icon-only" name="search" />
        </IonButton>
      </IonButtons>
      <IonButtons slot="primary">
        <IonButton color="secondary">
          <IonIcon slot="icon-only" name="more" />
        </IonButton>
      </IonButtons>
      <IonTitle>Default Buttons</IonTitle>
    </IonToolbar>

    <IonToolbar>
      <IonButtons slot="secondary">
        <IonButton fill="solid">
          <IonIcon slot="start" name="contact" />
          Contact
        </IonButton>
      </IonButtons>
      <IonTitle>Solid Buttons</IonTitle>
      <IonButtons slot="primary">
        <IonButton fill="solid" color="secondary">
          Help
          <IonIcon slot="end" name="help-circle" />
        </IonButton>
      </IonButtons>
    </IonToolbar>

    <IonToolbar>
      <IonButtons slot="secondary">
        <IonButton fill="outline">
          <IonIcon slot="start" name="star" />
          Star
        </IonButton>
      </IonButtons>
      <IonTitle>Outline Buttons</IonTitle>
      <IonButtons slot="primary">
        <IonButton color="danger" fill="outline">
          Edit
          <IonIcon slot="end" name="create" />
        </IonButton>
      </IonButtons>
    </IonToolbar>

    <IonToolbar>
      <IonButtons slot="secondary">
        <IonButton>Account</IonButton>
      </IonButtons>
      <IonButtons slot="primary">
        <IonButton color="danger">Edit</IonButton>
      </IonButtons>
      <IonTitle>Text Only Buttons</IonTitle>
    </IonToolbar>

    <IonToolbar>
      <IonButtons slot="start">
        <IonMenuButton autoHide={false} />
      </IonButtons>
      <IonButtons slot="secondary">
        <IonButton>
          <IonIcon slot="icon-only" name="star" />
        </IonButton>
      </IonButtons>
      <IonTitle>Left side menu toggle</IonTitle>
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
      <IonButtons slot="primary">
        <IonButton onClick={() => {}}>
          <IonIcon slot="icon-only" name="search" />
        </IonButton>
      </IonButtons>
      <IonSearchbar placeholder="Search Favorites" />
    </IonToolbar>

    <IonToolbar>
      <IonSegment>
        <IonSegmentButton value="all" checked>
          All
        </IonSegmentButton>
        <IonSegmentButton value="favorites">Favorites</IonSegmentButton>
      </IonSegment>
    </IonToolbar>

    <IonToolbar color="secondary">
      <IonButtons slot="secondary">
        <IonButton>
          <IonIcon slot="icon-only" name="contact" />
        </IonButton>
        <IonButton>
          <IonIcon slot="icon-only" name="search" />
        </IonButton>
      </IonButtons>
      <IonButtons slot="primary">
        <IonButton color="primary">
          <IonIcon slot="icon-only" name="more" />
        </IonButton>
      </IonButtons>
      <IonTitle>Secondary Toolbar</IonTitle>
    </IonToolbar>

    <IonToolbar color="dark">
      <IonButtons slot="secondary">
        <IonButton>
          <IonIcon slot="icon-only" name="contact" />
        </IonButton>
        <IonButton>
          <IonIcon slot="icon-only" name="search" />
        </IonButton>
      </IonButtons>
      <IonButtons slot="primary">
        <IonButton color="danger">
          <IonIcon slot="icon-only" name="more" />
        </IonButton>
      </IonButtons>
      <IonTitle>Dark Toolbar</IonTitle>
    </IonToolbar>
  </IonButton>
);
```
