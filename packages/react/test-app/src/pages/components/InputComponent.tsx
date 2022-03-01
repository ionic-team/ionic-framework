
import { useState } from 'react';
import { IonInput, IonItem, IonLabel, IonList, IonText } from '@ionic/react';

const InputComponent = () => {
  const [value, setValue] = useState("");

  const formatOnlyDigits = (val: any) => {
    return val.replace(/\D/g, "");
  }

  return (
    <IonList>
      <IonItem>
        <IonLabel>Input (masking)</IonLabel>
        <IonInput value={value} onIonInput={(ev: any) => setValue(formatOnlyDigits(ev.target.value))} />
        <IonText slot="helper">Try typing "123abc"</IonText>
      </IonItem>
    </IonList>
  );
};

export default InputComponent;
