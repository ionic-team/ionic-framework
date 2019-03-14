```tsx
import React from 'react';

import { IonLabel, IonItem, IonInput, IonToggle, IonCheckbox } from '@ionic/react';

const Example: React.SFC<{}> = () => (
  <>
    {/*-- Default Label --*/}
    <IonLabel>Label</IonLabel>

    {/*-- Label Colors --*/}
    <IonLabel color="primary">Primary Label</IonLabel>
    <IonLabel color="secondary">Secondary Label</IonLabel>
    <IonLabel color="danger">Danger Label</IonLabel>
    <IonLabel color="light">Light Label</IonLabel>
    <IonLabel color="dark">Dark Label</IonLabel>

    {/*-- Item Labels --*/}
    <IonItem>
      <IonLabel>Default Item</IonLabel>
    </IonItem>

    <IonItem>
      <IonLabel text-wrap>
        Multi-line text that should wrap when it is too long
        to fit on one line in the item.
      </IonLabel>
    </IonItem>

    {/*-- Input Labels --*/}
    <IonItem>
      <IonLabel>Default Input</IonLabel>
      <IonInput></IonInput>
    </IonItem>

    <IonItem>
      <IonLabel position="fixed">Fixed</IonLabel>
      <IonInput></IonInput>
    </IonItem>

    <IonItem>
      <IonLabel position="floating">Floating</IonLabel>
      <IonInput></IonInput>
    </IonItem>

    <IonItem>
      <IonLabel position="stacked">Stacked</IonLabel>
      <IonInput></IonInput>
    </IonItem>

    <IonItem>
      <IonLabel>Toggle</IonLabel>
      <IonToggle slot="end" checked></IonToggle>
    </IonItem>

    <IonItem>
      <IonCheckbox slot="start" checked />
      <IonLabel>Checkbox</IonLabel>
    </IonItem>
  </>
);

export default Example;
```
