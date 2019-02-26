```tsx
import React from 'react';

import { IonContent, IonInfiniteScroll } from '@ionic/react';

const Example: React.SFC<{}> = () => (

  <IonContent>
    <IonInfiniteScroll>
      <IonInfiniteScrollContent
        loadingSpinner="bubbles"
        loadingText="Loading more data…">
      </IonInfiniteScrollContent>
    </IonInfiniteScroll>
  </IonContent>
);

export default Example
