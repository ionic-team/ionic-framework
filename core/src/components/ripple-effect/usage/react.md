```tsx
import React from 'react';
import { IonApp, IonContent, IonRippleEffect } from '@ionic/react';
import './RippleEffectExample.css';

export const RippleExample: React.FC = () => (
  <IonApp>
   <IonContent>
      <div className="ion-activatable">
        A plain div with a bounded ripple effect
        <IonRippleEffect></IonRippleEffect>
      </div>

      <button className="ion-activatable">
        A button with a bounded ripple effect
        <IonRippleEffect></IonRippleEffect>
      </button>

      <div className="ion-activatable">
        A plain div with an unbounded ripple effect
        <IonRippleEffect type="unbounded"></IonRippleEffect>
      </div>

      <button className="ion-activatable">
        A button with an unbounded ripple effect
        <IonRippleEffect type="unbounded"></IonRippleEffect>
      </button>
    </IonContent>
  </IonApp>
);
```

```css
.ion-activatable {
  position: relative;
  overflow: hidden;
}
```