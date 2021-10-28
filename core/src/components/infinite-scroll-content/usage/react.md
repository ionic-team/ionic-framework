```tsx
import React from 'react';
import { IonContent, IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/react';

export const InfiniteScrollExample: React.FC = () => (
  <IonContent>
    <IonInfiniteScroll>
      <IonInfiniteScrollContent
        loadingSpinner="bubbles"
        loadingText="Loading more data...">
      </IonInfiniteScrollContent>
    </IonInfiniteScroll>
  </IonContent>
);
```