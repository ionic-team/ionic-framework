# ion-footer

Footer is a root component of a page that sits at the bottom of the page.
Footer can be a wrapper for ion-toolbar to make sure the content area is sized correctly.

<!-- Auto Generated Below -->


## Usage

### Javascript

```html
<ion-content></ion-content>

<ion-footer>
  <ion-toolbar>
    <ion-title>Footer</ion-title>
  </ion-toolbar>
</ion-footer>
```


### React

```tsx
import React from 'react';

import { IonContent, IonFooter, IonToolbar, IonTitle } from '@ionic/react';

const Example: React.SFC<{}> = () => (
  <>
    <IonContent></IonContent>

    <IonFooter>
      <IonToolbar>
        <IonTitle>Footer</IonTitle>
      </IonToolbar>
    </IonFooter>
  </>
);

export default Example;
```



## Properties

| Property      | Attribute     | Description                                                                                                                                               | Type            | Default     |
| ------------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- | ----------- |
| `mode`        | `mode`        | The mode determines which platform styles to use.                                                                                                         | `"ios" \| "md"` | `undefined` |
| `translucent` | `translucent` | If `true`, the footer will be translucent. Note: In order to scroll content behind the footer, the `fullscreen` attribute needs to be set on the content. | `boolean`       | `false`     |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
