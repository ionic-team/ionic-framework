```tsx
import React from 'react';
import { IonCheckbox, IonList, IonItem, IonLabel, IonContent } from '@ionic/react';

const form = [
  { val: 'Pepperoni', isChecked: true },
  { val: 'Sausage', isChecked: false },
  { val: 'Mushroom', isChecked: false }
];

export const CheckboxExample: React.FunctionComponent = () => (
  <IonContent>
    {/*-- Default Checkbox --*/}
    <IonCheckbox />

    {/*-- Disabled Checkbox --*/}
    <IonCheckbox disabled={true} />

    {/*-- Checked Checkbox --*/}
    <IonCheckbox checked={true} />

    {/*-- Checkbox Colors --*/}
    <IonCheckbox color="primary" />
    <IonCheckbox color="secondary" />
    <IonCheckbox color="danger" />
    <IonCheckbox color="light" />
    <IonCheckbox color="dark" />

    {/*-- Checkboxes in a List --*/}
    <IonList>
      { form.map(({val, isChecked}) => (
        <IonItem key={val}>
          <IonLabel>{val}</IonLabel>
          <IonCheckbox slot="end" value={val} checked={isChecked} />
        </IonItem>
      )) }
    </IonList>
  </IonContent>
);
```