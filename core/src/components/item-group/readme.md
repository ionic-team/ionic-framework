# ion-item-group

Item groups are containers that organize similar items together. They can contain item dividers to divide the items into multiple sections.




<!-- Auto Generated Below -->


## Usage

### Angular / javascript

```html
<ion-item-group>
  <ion-item-divider>
    <ion-label>A</ion-label>
  </ion-item-divider>

  <ion-item>
    <ion-label>Angola</ion-label>
  </ion-item>
  <ion-item>
    <ion-label>Argentina</ion-label>
  </ion-item>
  <ion-item>
    <ion-label>Armenia</ion-label>
  </ion-item>
</ion-item-group>

<ion-item-group>
  <ion-item-divider>
    <ion-label>B</ion-label>
  </ion-item-divider>

  <ion-item>
    <ion-label>Bangladesh</ion-label>
  </ion-item>
  <ion-item>
    <ion-label>Belarus</ion-label>
  </ion-item>
  <ion-item>
    <ion-label>Belgium</ion-label>
  </ion-item>
</ion-item-group>


<!-- They can also be used to group sliding items -->
<ion-item-group>
  <ion-item-divider>
    <ion-label>
      Fruits
    </ion-label>
  </ion-item-divider>

  <ion-item-sliding>
    <ion-item>
      <ion-label>
        <h3>Grapes</h3>
      </ion-label>
    </ion-item>
    <ion-item-options>
      <ion-item-option>
        Favorite
      </ion-item-option>
    </ion-item-options>
  </ion-item-sliding>

  <ion-item-sliding>
    <ion-item>
      <ion-label>
        <h3>Apples</h3>
      </ion-label>
    </ion-item>
    <ion-item-options>
      <ion-item-option>
        Favorite
      </ion-item-option>
    </ion-item-options>
  </ion-item-sliding>
</ion-item-group>

<ion-item-group>
  <ion-item-divider>
    <ion-label>
      Vegetables
    </ion-label>
  </ion-item-divider>

  <ion-item-sliding>
    <ion-item>
      <ion-label>
        <h3>Carrots</h3>
      </ion-label>
    </ion-item>
    <ion-item-options>
      <ion-item-option>
        Favorite
      </ion-item-option>
    </ion-item-options>
  </ion-item-sliding>

  <ion-item-sliding>
    <ion-item>
      <ion-label>
        <h3>Celery</h3>
      </ion-label>
    </ion-item>
    <ion-item-options>
      <ion-item-option>
        Favorite
      </ion-item-option>
    </ion-item-options>
  </ion-item-sliding>
</ion-item-group>
```


### React

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


### Vue

```html
<template>
  <ion-item-group>
    <ion-item-divider>
      <ion-label>A</ion-label>
    </ion-item-divider>

    <ion-item>
      <ion-label>Angola</ion-label>
    </ion-item>
    <ion-item>
      <ion-label>Argentina</ion-label>
    </ion-item>
    <ion-item>
      <ion-label>Armenia</ion-label>
    </ion-item>
  </ion-item-group>

  <ion-item-group>
    <ion-item-divider>
      <ion-label>B</ion-label>
    </ion-item-divider>

    <ion-item>
      <ion-label>Bangladesh</ion-label>
    </ion-item>
    <ion-item>
      <ion-label>Belarus</ion-label>
    </ion-item>
    <ion-item>
      <ion-label>Belgium</ion-label>
    </ion-item>
  </ion-item-group>


  <!-- They can also be used to group sliding items -->
  <ion-item-group>
    <ion-item-divider>
      <ion-label>
        Fruits
      </ion-label>
    </ion-item-divider>

    <ion-item-sliding>
      <ion-item>
        <ion-label>
          <h3>Grapes</h3>
        </ion-label>
      </ion-item>
      <ion-item-options>
        <ion-item-option>
          Favorite
        </ion-item-option>
      </ion-item-options>
    </ion-item-sliding>

    <ion-item-sliding>
      <ion-item>
        <ion-label>
          <h3>Apples</h3>
        </ion-label>
      </ion-item>
      <ion-item-options>
        <ion-item-option>
          Favorite
        </ion-item-option>
      </ion-item-options>
    </ion-item-sliding>
  </ion-item-group>

  <ion-item-group>
    <ion-item-divider>
      <ion-label>
        Vegetables
      </ion-label>
    </ion-item-divider>

    <ion-item-sliding>
      <ion-item>
        <ion-label>
          <h3>Carrots</h3>
        </ion-label>
      </ion-item>
      <ion-item-options>
        <ion-item-option>
          Favorite
        </ion-item-option>
      </ion-item-options>
    </ion-item-sliding>

    <ion-item-sliding>
      <ion-item>
        <ion-label>
          <h3>Celery</h3>
        </ion-label>
      </ion-item>
      <ion-item-options>
        <ion-item-option>
          Favorite
        </ion-item-option>
      </ion-item-options>
    </ion-item-sliding>
  </ion-item-group>
</template>
```



----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
