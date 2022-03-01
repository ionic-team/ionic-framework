
import { useState } from 'react';
import { IonItem, IonLabel, IonList, IonSearchbar, IonText } from '@ionic/react';

const SearchbarComponent = () => {
  const [value, setValue] = useState("");

  const formatOnlyDigits = (val: any) => {
    return val.replace(/\D/g, "");
  }

  return (
    <IonList>
      <IonItem>
        <IonLabel>Searchbar (masking)</IonLabel>
        <IonSearchbar value={value} onIonInput={(ev: any) => setValue(formatOnlyDigits(ev.target.value))} />
        <IonText slot="helper">Try typing "123abc"</IonText>
      </IonItem>
      <IonItem>
        <IonLabel>React component value - {value}</IonLabel>
      </IonItem>
    </IonList>
  );
};

export default SearchbarComponent;
