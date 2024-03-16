import {
  IonButton,
  IonContent,
  IonIcon,
  IonItem,
  IonList,
  IonListHeader,
  IonPage,
  IonPopover,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { arrowForward } from 'ionicons/icons';
import { useRef } from 'react';

const IonPopoverNested = () => {
  const menuPopover = useRef<HTMLIonPopoverElement>(null);
  const submenuPopover = useRef<HTMLIonPopoverElement>(null);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Nested Popover</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonButton id="open">Show Popover</IonButton>
        <IonPopover ref={menuPopover} id="menu-popover" trigger="open">
          <IonList>
            <IonListHeader>Menu Items</IonListHeader>
            <IonItem>Item 1</IonItem>
            <IonItem>Item 2</IonItem>
            <IonItem>Item 3</IonItem>
            <IonItem button id="item-4">
              More
              <IonIcon icon={arrowForward} slot="end" />
            </IonItem>
            <IonItem button id="close-menu-popover" onClick={() => menuPopover.current!.dismiss()}>
              Close
            </IonItem>
          </IonList>
          <IonPopover ref={submenuPopover} id="submenu-popover" trigger="item-4" side="right">
            <IonList>
              <IonListHeader>Submenu Items</IonListHeader>
              <IonItem>Item 1</IonItem>
              <IonItem>Item 2</IonItem>
              <IonItem>Item 3</IonItem>
              <IonItem
                id="close-submenu-popover"
                button
                onClick={() => submenuPopover.current!.dismiss()}
              >
                Close
              </IonItem>
            </IonList>
          </IonPopover>
        </IonPopover>
      </IonContent>
    </IonPage>
  );
};

export default IonPopoverNested;
