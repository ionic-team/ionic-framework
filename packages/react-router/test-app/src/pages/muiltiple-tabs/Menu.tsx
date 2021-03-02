import React from 'react';
import { IonMenu, IonContent, IonList, IonItem, IonLabel, IonMenuToggle } from '@ionic/react';
export const Menu: React.FC = () => {
  return (
    <IonMenu contentId="main" menuId="first">
      <IonContent>
        <IonList>
          <IonMenuToggle key={'e1'} autoHide={false}>
            <IonItem
              routerLink={'/multiple-tabs'}
              routerDirection="none"
              lines="none"
              detail={false}
            >
              <IonLabel>Tab 1</IonLabel>
            </IonItem>
          </IonMenuToggle>
          <IonMenuToggle key={'e2'} autoHide={false}>
            <IonItem
              routerLink={'/multiple-tabs/tab2'}
              routerDirection="none"
              lines="none"
              detail={false}
            >
              <IonLabel>Tab 2</IonLabel>
            </IonItem>
          </IonMenuToggle>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};
