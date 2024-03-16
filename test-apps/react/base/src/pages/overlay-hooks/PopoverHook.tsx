import React from 'react';
import {
  IonButton,
  IonContent,
  IonItem,
  IonList,
  IonListHeader,
  IonPage,
  useIonPopover,
} from '@ionic/react';

const PopoverList: React.FC<{
  onHide: () => void;
}> = ({ onHide }) => (
  <IonList>
    <IonListHeader>Ionic</IonListHeader>
    <IonItem button>Learn Ionic</IonItem>
    <IonItem button>Documentation</IonItem>
    <IonItem button>Showcase</IonItem>
    <IonItem button>GitHub Repo</IonItem>
    <IonItem lines="none" detail={false} button onClick={onHide}>
      Close
    </IonItem>
  </IonList>
);

const PopoverHook: React.FC = () => {
  const [presentWithComponent, dismissWithComponent] = useIonPopover(PopoverList, {
    onHide: () => dismissWithComponent(),
  });
  const [presentWithElement, dismissWithElement] = useIonPopover(
    <PopoverList onHide={() => dismissWithElement()} />
  );

  return (
    <IonPage>
      <IonContent>
        <IonButton
          expand="block"
          onClick={(e) =>
            presentWithComponent({
              event: e.nativeEvent,
            })
          }
        >
          Show Popover with component param
        </IonButton>
        <IonButton
          expand="block"
          onClick={(e) =>
            presentWithElement({
              event: e.nativeEvent,
            })
          }
        >
          Show Popover with element param
        </IonButton>
        <IonButton
          expand="block"
          onClick={(e) => {
            presentWithComponent({
              event: e.nativeEvent,
            });
            setTimeout(dismissWithComponent, 250);
          }}
        >
          Show Popover, hide after 250 ms
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default PopoverHook;
