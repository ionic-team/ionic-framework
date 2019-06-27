```tsx
import React from 'react';
import { IonInput, IonItem, IonLabel, IonContent } from '@ionic/react';

export const InputExample: React.FunctionComponent = () => (
  <IonContent>
    {/*-- Default Input --*/}
    <IonInput></IonInput>

    {/*-- Input with value --*/}
    <IonInput value="custom"></IonInput>

    {/*-- Input with placeholder --*/}
    <IonInput placeholder="Enter Input"></IonInput>

    {/*-- Input with clear button when there is a value --*/}
    <IonInput clearInput value="clear me"></IonInput>

    {/*-- Number type input --*/}
    <IonInput type="number" value="333"></IonInput>

    {/*-- Disabled input --*/}
    <IonInput value="Disabled" disabled></IonInput>

    {/*-- Readonly input --*/}
    <IonInput value="Readonly" readonly></IonInput>

    {/*-- Inputs with labels --*/}
    <IonItem>
      <IonLabel>Default Label</IonLabel>
      <IonInput></IonInput>
    </IonItem>

    <IonItem>
      <IonLabel position="floating">Floating Label</IonLabel>
      <IonInput></IonInput>
    </IonItem>

    <IonItem>
      <IonLabel position="fixed">Fixed Label</IonLabel>
      <IonInput></IonInput>
    </IonItem>

    <IonItem>
      <IonLabel position="stacked">Stacked Label</IonLabel>
      <IonInput></IonInput>
    </IonItem>
  </IonContent>
);
```