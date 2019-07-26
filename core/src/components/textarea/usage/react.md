```tsx
import React from 'react';
import { IonTextarea, IonItem, IonLabel, IonContent } from '@ionic/react';

export const TextAreaExample: React.FunctionComponent = () => (
  <IonContent>
    {/*-- Default textarea --*/}
    <IonTextarea></IonTextarea>

    {/*-- Textarea in an item with a placeholder --*/}
    <IonItem>
      <IonTextarea placeholder="Enter more information here..."></IonTextarea>
    </IonItem>

    {/*-- Textarea in an item with a floating label --*/}
    <IonItem>
      <IonLabel position="floating">Description</IonLabel>
      <IonTextarea></IonTextarea>
    </IonItem>

    {/*-- Disabled and readonly textarea in an item with a stacked label --*/}
    <IonItem>
      <IonLabel position="stacked">Summary</IonLabel>
      <IonTextarea
        disabled
        readonly
        value="Ionic enables developers to build performant, high-quality mobile apps.">
      </IonTextarea>
    </IonItem>

    {/*-- Textarea that clears the value on edit --*/}
    <IonItem>
      <IonLabel>Comment</IonLabel>
      <IonTextarea clearOnEdit={true}></IonTextarea>
    </IonItem>

    {/*-- Textarea with custom number of rows and cols --*/}
    <IonItem>
      <IonLabel>Notes</IonLabel>
      <IonTextarea rows={6} cols={20} placeholder="Enter any notes here..."></IonTextarea>
    </IonItem>
  </IonContent>
);
```
