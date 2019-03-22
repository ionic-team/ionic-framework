```tsx
import React from 'react';

import { IonList, IonItem, IonThumbnail, IonImg, IonLabel } from '@ionic/react';

type Item = {
  src: string;
  text: string
};
const items: Item[] = [];

const Example: React.SFC<{}> = () => (

  <IonList>
    {items.map(({src, text}) =>
      <IonItem>
        <IonThumbnail slot="start">
          <IonImg src={src}></IonImg>
        </IonThumbnail>
        <IonLabel>{text}}</IonLabel>
      </IonItem>
    )}
  </IonList>
);

export default Example
