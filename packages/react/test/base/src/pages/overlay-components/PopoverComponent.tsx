import React, { useState } from 'react';
import {
  IonButton,
  IonContent,
  IonItem,
  IonList,
  IonListHeader,
  IonPage,
  IonPopover,
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

const PopoverComponent: React.FC = () => {
  const [popoverState, setShowPopover] = useState<{ showPopover: boolean; event?: Event }>({
    showPopover: false,
    event: undefined,
  });

  const [renderItem, setRenderItem] = useState(true);

  return (
    <IonPage>
      <IonContent>
        <IonPopover
          isOpen={popoverState.showPopover}
          event={popoverState.event}
          onDidDismiss={() => setShowPopover({ showPopover: false, event: undefined })}
        >
          <PopoverList onHide={() => setShowPopover({ showPopover: false, event: undefined })} />
        </IonPopover>
        <IonButton
          expand="block"
          onClick={(e) =>
            setShowPopover({
              showPopover: true,
              event: e.nativeEvent,
            })
          }
        >
          Show Popover
        </IonButton>
        <IonButton
          expand="block"
          onClick={(e) => {
            setShowPopover({
              showPopover: true,
              event: e.nativeEvent,
            });
            setTimeout(
              () =>
                setShowPopover({
                  showPopover: false,
                  event: undefined,
                }),
              250
            );
          }}
        >
          Show Popover, hide after 250 ms
        </IonButton>
        {renderItem && <IonItem>
          <IonButton id="openPopover">Open</IonButton>
          <IonPopover id="popoverInItem" trigger="openPopover" dismissOnSelect={true}>
            <IonButton id="removeItem" onClick={() => setRenderItem(false)}>Remove Item</IonButton>
          </IonPopover>
        </IonItem>}
      </IonContent>
    </IonPage>
  );
};

export default PopoverComponent;