import React, { useState } from 'react';
import {
  IonButton,
  IonContent,
  IonItem,
  IonLabel,
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
        <div className="ion-padding" />
        <div className="ion-padding" />
        <div className="ion-padding" />
        <div className="ion-padding" />
        <div className="ion-padding" />
        <div className="ion-padding" />
        <div className="ion-padding" />
        <div className="ion-padding" />
        <div className="ion-padding" />
        <div className="ion-padding" />
        <div className="ion-padding" />
        <div className="ion-padding" />

        <IonButton id="top-center">Side=Top, Alignment=Center</IonButton>
        <IonPopover trigger="top-center" side="top" alignment="center">
          <IonContent>
            <IonList>
              <IonItem button>
                <IonLabel>Hello World!</IonLabel>
              </IonItem>
              <IonItem button>
                <IonLabel>Hello World!</IonLabel>
              </IonItem>
              <IonItem button>
                <IonLabel>Hello World!</IonLabel>
              </IonItem>
              <IonItem button>
                <IonLabel>Hello World!</IonLabel>
              </IonItem>
              <IonItem button lines="none">
                <IonLabel>Hello World!</IonLabel>
              </IonItem>
            </IonList>
          </IonContent>
        </IonPopover>

        <IonButton id="bottom-start">Side=Bottom, Alignment=Start</IonButton>
        <IonPopover trigger="bottom-start" side="bottom" alignment="start">
          <IonContent class="ion-padding">Hello World!</IonContent>
        </IonPopover>

        <IonButton id="left-start">Side=Left, Alignment=Start</IonButton>
        <IonPopover trigger="left-start" side="left" alignment="start">
          <IonContent class="ion-padding">Hello World!</IonContent>
        </IonPopover>

        <IonButton id="right-end">Side=Right, Alignment=End</IonButton>
        <IonPopover trigger="right-end" side="right" alignment="end">
          <IonContent class="ion-padding">Hello World!</IonContent>
        </IonPopover>
      </IonContent>
    </IonPage>
  );
};

export default PopoverComponent;
