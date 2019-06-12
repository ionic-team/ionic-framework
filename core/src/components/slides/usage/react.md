```tsx
import React from 'react';
import { IonSlides, IonSlide, IonContent } from '@ionic/react';

// Optional parameters to pass to the swiper instance. See http://idangero.us/swiper/api/ for valid options.
const slideOpts = {
  initialSlide: 1,
  speed: 400
};

export const SlidesExample: React.FunctionComponent = () => (
  <IonContent>
    <IonSlides pager={true} options={slideOpts}>
      <IonSlide>
        <h1>Slide 1</h1>
      </IonSlide>
      <IonSlide>
        <h1>Slide 2</h1>
      </IonSlide>
      <IonSlide>
        <h1>Slide 3</h1>
      </IonSlide>
    </IonSlides>
  </IonContent>
);
```
