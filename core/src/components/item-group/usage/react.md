```tsx
import React from 'react';

import { IonItemGroup, IonItemDivider, IonLabel, IonItem, IonItemSliding, IonItemOptions, IonItemOption } from '@ionic/react';

const Example: React.FunctionComponent<{}> = () => (
  <>
    <IonItemGroup>
      <IonItemDivider>
        <IonLabel>A</IonLabel>
      </IonItemDivider>

      <IonItem>
        <IonLabel>Angola</IonLabel>
      </IonItem>
      <IonItem>
        <IonLabel>Argentina</IonLabel>
      </IonItem>
      <IonItem>
        <IonLabel>Armenia</IonLabel>
      </IonItem>
    </IonItemGroup>

    <IonItemGroup>
      <IonItemDivider>
        <IonLabel>B</IonLabel>
      </IonItemDivider>

      <IonItem>
        <IonLabel>Bangladesh</IonLabel>
      </IonItem>
      <IonItem>
        <IonLabel>Belarus</IonLabel>
      </IonItem>
      <IonItem>
        <IonLabel>Belgium</IonLabel>
      </IonItem>
    </IonItemGroup>


    {/*-- They can also be used to group sliding items --*/}
    <IonItemGroup>
      <IonItemDivider>
        <IonLabel>
          Fruits
        </IonLabel>
      </IonItemDivider>

      <IonItemSliding>
        <IonItem>
          <IonLabel>
            <h3>Grapes</h3>
          </IonLabel>
        </IonItem>
        <IonItemOptions>
          <IonItemOption>
            Favorite
          </IonItemOption>
        </IonItemOptions>
      </IonItemSliding>

      <IonItemSliding>
        <IonItem>
          <IonLabel>
            <h3>Apples</h3>
          </IonLabel>
        </IonItem>
        <IonItemOptions>
          <IonItemOption>
            Favorite
          </IonItemOption>
        </IonItemOptions>
      </IonItemSliding>
    </IonItemGroup>

    <IonItemGroup>
      <IonItemDivider>
        <IonLabel>
          Vegetables
        </IonLabel>
      </IonItemDivider>

      <IonItemSliding>
        <IonItem>
          <IonLabel>
            <h3>Carrots</h3>
          </IonLabel>
        </IonItem>
        <IonItemOptions>
          <IonItemOption>
            Favorite
          </IonItemOption>
        </IonItemOptions>
      </IonItemSliding>

      <IonItemSliding>
        <IonItem>
          <IonLabel>
            <h3>Celery</h3>
          </IonLabel>
        </IonItem>
        <IonItemOptions>
          <IonItemOption>
            Favorite
          </IonItemOption>
        </IonItemOptions>
      </IonItemSliding>
    </IonItemGroup>
  </>
);

export default Example;
```
