```tsx
import React from 'react';
import { IonList, IonItem, IonVideo IonContent } from '@ionic/react';

type Item = {
  src: string;
};
const items: Item[] = [{ src: 'https://www.w3schools.com/html/mov_bbb.mp4' }];

export const VideoExample: React.FunctionComponent = () => (
  <IonContent>
    <IonList>
      {items.map((video, i) => (
        <IonVideo key={i} src={video.src}></IonVideo>
      ))}
    </IonList>
  </IonContent>
);
```