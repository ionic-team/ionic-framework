
import { useState } from 'react';
import { IonItem, IonLabel, IonList, IonText, IonTextarea } from '@ionic/react';

const TextareaComponent = () => {
  const [value, setValue] = useState("");

  const formatOnlyDigits = (val: any) => {
    return val.replace(/\D/g, "");
  }

  return (
    <IonList>
      <IonItem>
        <IonLabel>Textarea (masking)</IonLabel>
        <IonTextarea value={value} onIonInput={(ev: any) => setValue(formatOnlyDigits(ev.target.value))} />
        <IonText slot="helper">Try typing "123abc"</IonText>
      </IonItem>
      <IonItem>
        <IonLabel>React component value - {value}</IonLabel>
      </IonItem>
    </IonList>
  );
};

export default TextareaComponent;
