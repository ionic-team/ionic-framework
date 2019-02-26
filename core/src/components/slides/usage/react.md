```tsx
import React from 'react';

import { IonSlides, IonSlide } from '@ionic/react';

const slideOpts = {
  effect: 'flip'
};

const Example: React.SFC<{}> = () => (
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
);

export default Example;
```
