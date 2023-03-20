import React, { useState } from 'react';
import { IonButton, IonContent, IonPage, useIonPicker } from '@ionic/react';

const PickerHook: React.FC = () => {
  const [present, dismiss] = useIonPicker();
  const [value, setValue] = useState('');
  return (
    <IonPage>
      <IonContent>
        <IonButton
          expand="block"
          onClick={() =>
            present({
              buttons: [
                {
                  text: 'Confirm',
                  handler: (selected) => {
                    console.log(`${selected.animal.value} picked`);
                    setValue(selected.animal.value);
                  },
                },
              ],
              columns: [
                {
                  name: 'animal',
                  options: [
                    { text: 'Dog', value: 'dog' },
                    { text: 'Cat', value: 'cat' },
                    { text: 'Bird', value: 'bird' },
                  ],
                },
              ],
            })
          }
        >
          Show Picker with options
        </IonButton>
        <IonButton
          expand="block"
          onClick={() =>
            present(
              [
                {
                  name: 'animal',
                  options: [
                    { text: 'Dog', value: 'dog' },
                    { text: 'Cat', value: 'cat' },
                    { text: 'Bird', value: 'bird' },
                  ],
                },
                {
                  name: 'vehicle',
                  options: [
                    { text: 'Car', value: 'car' },
                    { text: 'Truck', value: 'truck' },
                    { text: 'Bike', value: 'bike' },
                  ],
                },
              ],
              [
                {
                  text: 'Confirm',
                  handler: (selected) => {
                    setValue(`${selected.animal.value}, ${selected.vehicle.value}`);
                  },
                },
              ]
            )
          }
        >
          Show Picker with params
        </IonButton>
        <IonButton
          expand="block"
          onClick={() => {
            present([
              {
                name: 'animal',
                options: [
                  { text: 'Dog', value: 'dog' },
                  { text: 'Cat', value: 'cat' },
                  { text: 'Bird', value: 'bird' },
                ],
              },
            ]);
            setTimeout(dismiss, 250);
          }}
        >
          Show Picker, hide after 250 ms
        </IonButton>
        {value && <div>Selected Value: {value}</div>}
      </IonContent>
    </IonPage>
  );
};

export default PickerHook;
