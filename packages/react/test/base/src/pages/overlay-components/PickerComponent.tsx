import React, { useState } from 'react';
import { IonButton, IonContent, IonPage, IonPicker } from '@ionic/react';

const PickerComponent: React.FC = () => {
  const [show, setShow] = useState(false);
  const [value, setValue] = useState('');
  return (
    <IonPage>
      <IonContent>
        <IonPicker
          isOpen={show}
          buttons={[
            {
              text: 'Confirm',
              handler: (selected) => {
                setValue(`${selected.animal.value}, ${selected.vehicle.value}`);
              },
            },
          ]}
          columns={[
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
          ]}
          onDidDismiss={() => setShow(false)}
        />
        <IonButton expand="block" onClick={() => setShow(true)}>
          Show Picker
        </IonButton>

        <IonButton
          expand="block"
          onClick={() => {
            setShow(true);
            setTimeout(() => setShow(false), 250);
          }}
        >
          Show Picker, hide after 250 ms
        </IonButton>
        {value && <div>Selected Value: {value}</div>}
      </IonContent>
    </IonPage>
  );
};

export default PickerComponent;
