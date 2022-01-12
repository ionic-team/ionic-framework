```tsx
import React from 'react';
import { IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonMenuToggle, IonButton } from '@ionic/react';

export const MenuExample: React.FC = () => (
  <>
    <IonMenu side="start" menuId="first">
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Example Menu</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem>Menu Item</IonItem>
        </IonList>
      </IonContent>
    </IonMenu>
    <IonContent>
      <IonMenuToggle>
        <IonButton>Toggle Menu</IonButton>
      </IonMenuToggle>
    </IonContent>
  </>
);
```