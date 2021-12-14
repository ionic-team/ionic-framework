### Inline Popover

```tsx
import React, { useState } from 'react';
import { IonPopover, IonContent, IonItem, IonLabel, IonButton } from '@ionic/react';

export const PopoverExample: React.FC = () => {
  return (
    <>
      {/* Default */}
      <IonPopover isOpen={true}>
        <IonContent>Popover Content</IonContent>
      </IonPopover>
      
      {/* No Arrow */}
      <IonPopover isOpen={true} arrow={false}>
        <IonContent>Popover Content</IonContent>
      </IonPopover>
      
      {/* Use a trigger */}
      <IonButton id="trigger-button">Click to open popover</IonButton>
      <IonPopover trigger="trigger-button">
        <IonContent>Popover Content</IonContent>
      </IonPopover>
      
      {/* Hover over trigger to open */}
      <IonButton id="hover-button">Hover to open popover</IonButton>
      <IonPopover trigger="hover-button" triggerAction="hover">
        <IonContent>Popover Content</IonContent>
      </IonPopover>
      
      {/* Show popover above trigger */}
      <IonButton id="side-button">Click to open popover</IonButton>
      <IonPopover trigger="side-button" side="top">
        <IonContent>Popover Content</IonContent>
      </IonPopover>
      
      {/* Align popover to end of trigger */}
      <IonButton id="alignment-button">Click to open popover</IonButton>
      <IonPopover trigger="alignment-button" side="top" alignment="end">
        <IonContent>Popover Content</IonContent>
      </IonPopover>
      
      {/* Make popover the same size as the trigger */}
      <IonButton id="size-button">Click to open popover</IonButton>
      <IonPopover trigger="size-button" size="cover">
        <IonContent>Popover Content</IonContent>
      </IonPopover>
      
      {/* Make popover show relative to click coordinates rather than trigger */}
      <IonButton id="size-button">Click to open popover</IonButton>
      <IonPopover trigger="size-button" reference="event">
        <IonContent>Popover Content</IonContent>
      </IonPopover>
      
      {/* Nested Popover */}
      <IonButton id="nested-button">Click to open popover</IonButton>
      <IonPopover trigger="nested-button" dismissOnSelect={true}>
        <IonContent>
          <ion-list>
            <IonItem button={true} detail={false}>
              <IonLabel>Option 1</IonLabel>
            </IonItem>
            <IonItem button={true} detail={false}>
              <IonLabel>Option 2</IonLabel>
            </IonItem>
            <IonItem button={true} detail={true} id="nested-trigger">
              <IonLabel>Option 3</IonLabel>
            </IonItem>
            
            <IonPopover trigger="nested-trigger" dismissOnSelect={true} side="end">
              <IonContent>
                <IonItem button={true}>
                  <IonLabel>Nested Option</IonLabel>
                </IonItem>
              </IonContent>
            </IonPopover>
          </ion-list>
        </IonContent>
      </IonPopover>
    </>
  );
};
```

### Inline Popover with State

```tsx
import React, { useState } from 'react';
import { IonPopover, IonButton } from '@ionic/react';

export const PopoverExample: React.FC = () => {
  const [popoverState, setShowPopover] = useState({ showPopover: false, event: undefined });

  return (
    <>
      <IonPopover
        cssClass='my-custom-class'
        event={popoverState.event}
        isOpen={popoverState.showPopover}
        onDidDismiss={() => setShowPopover({ showPopover: false, event: undefined })}
      >
        <p>This is popover content</p>
      </IonPopover>
      <IonButton onClick={
        (e: any) => {
          e.persist();
          setShowPopover({ showPopover: true, event: e })
        }}
      >
        Show Popover
      </IonButton>
    </>
  );
};
```

### useIonPopover Hook

> `useIonPopover` requires being a descendant of `<IonApp>`. If you need to use a popover outside of an `<IonApp>`, consider using the component method instead.

```tsx
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

const PopoverExample: React.FC = () => {
  const [present, dismiss] = useIonPopover(PopoverList, { onHide: () => dismiss() });
  
  return (
    <IonPage>
      <IonContent>
        <IonButton
          expand="block"
          onClick={(e) =>
            present({
              event: e.nativeEvent,
            })
          }
        >
          Show Popover
        </IonButton>
      </IonContent>
    </IonPage>
  );
};
```