```tsx
import React from 'react';
import { IonContent, IonFab, IonFabButton, IonIcon, IonFabList } from '@ionic/react';

export const FabExample: React.FunctionComponent = () => (
  <IonContent>
    {/*-- fab placed to the top end --*/}
    <IonFab vertical="top" horizontal="end" slot="fixed">
      <IonFabButton>
        <IonIcon name="add" />
      </IonFabButton>
    </IonFab>

    {/*-- fab placed to the bottom end --*/}
    <IonFab vertical="bottom" horizontal="end" slot="fixed">
      <IonFabButton>
        <IonIcon name="arrow-dropleft" />
      </IonFabButton>
    </IonFab>

    {/*-- fab placed to the top start --*/}
    <IonFab vertical="top" horizontal="start" slot="fixed">
      <IonFabButton>
        <IonIcon name="arrow-dropright" />
      </IonFabButton>
    </IonFab>

    {/*-- fab placed to the bottom start --*/}
    <IonFab vertical="bottom" horizontal="start" slot="fixed">
      <IonFabButton>
        <IonIcon name="arrow-dropup" />
      </IonFabButton>
    </IonFab>

    {/*-- fab placed to the (vertical) center and start --*/}
    <IonFab vertical="center" horizontal="start" slot="fixed">
      <IonFabButton>
        <IonIcon name="share" />
      </IonFabButton>
    </IonFab>

    {/*-- fab placed to the (vertical) center and end --*/}
    <IonFab vertical="center" horizontal="end" slot="fixed">
      <IonFabButton>
        <IonIcon name="add" />
      </IonFabButton>
    </IonFab>

    {/*-- fab placed to the top and end and on the top edge of the content overlapping header --*/}
    <IonFab vertical="top" horizontal="end" edge slot="fixed">
      <IonFabButton>
        <IonIcon name="person" />
      </IonFabButton>
    </IonFab>

    {/*-- fab placed to the bottom and start and on the bottom edge of the content overlapping footer with a list to the right --*/}
    <IonFab vertical="bottom" horizontal="start" edge slot="fixed">
      <IonFabButton>
        <IonIcon name="settings" />
      </IonFabButton>
      <IonFabList side="end">
        <IonFabButton><IonIcon name="logo-vimeo" /></IonFabButton>
      </IonFabList>
    </IonFab>

    {/*-- fab placed in the center of the content with a list on each side --*/}
    <IonFab vertical="center" horizontal="center" slot="fixed">
      <IonFabButton>
        <IonIcon name="share" />
      </IonFabButton>
      <IonFabList side="top">
        <IonFabButton><IonIcon name="logo-vimeo" /></IonFabButton>
      </IonFabList>
      <IonFabList side="bottom">
        <IonFabButton><IonIcon name="logo-facebook" /></IonFabButton>
      </IonFabList>
      <IonFabList side="start">
        <IonFabButton><IonIcon name="logo-instagram" /></IonFabButton>
      </IonFabList>
      <IonFabList side="end">
        <IonFabButton><IonIcon name="logo-twitter" /></IonFabButton>
      </IonFabList>
    </IonFab>
  </IonContent>
);
```
