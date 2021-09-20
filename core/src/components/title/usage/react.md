```tsx
import React from 'react';
import {
  IonTitle,
  IonToolbar
} from '@ionic/react';

export const ToolbarExample: React.FC = () => (
  {/*-- Default title --*/}
  <IonToolbar>
    <IonTitle>Default Title</IonTitle>
  </IonToolbar>

  {/*-- Small title --*/}
  <IonToolbar>
    <IonTitle size="small">Small Title above a Default Title</IonTitle>
  </IonToolbar>
  <IonToolbar>
    <IonTitle>Default Title</IonTitle>
  </IonToolbar>

  {/*-- Large title --*/}
  <IonToolbar>
    <IonTitle size="large">Large Title</IonTitle>
  </IonToolbar>
);
```

### Collapsible Large Titles

Ionic provides a way to create the collapsible titles that exist on stock iOS apps. Getting this setup requires configuring your `IonTitle`, `IonHeader`, and (optionally) `IonButtons` elements.

```tsx
import React from 'react';
import {
  IonContent,
  IonHeader,
  IonSearchbar,
  IonTitle,
  IonToolbar
} from '@ionic/react';

export const LargeTitleExample: React.FC = () => (
  <>
    <IonHeader translucent="true">
      <IonToolbar>
        <IonTitle>Settings</IonTitle>
      </IonToolbar>
    </IonHeader>

    <IonContent fullscreen="true">
      <IonHeader collapse="condense">
        <IonToolbar>
          <IonTitle size="large">Settings</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar></IonSearchbar>
        </IonToolbar>
      </IonHeader>

      ...

    </IonContent>
  </>
);
```

In the example above, notice there are two `IonHeader` elements. The first `IonHeader` represents the "collapsed" state of your collapsible header, and the second `IonHeader` represents the "expanded" state of your collapsible header. Notice that the second `IonHeader` must have `collapse="condense"` and must exist within `IonContent`. Additionally, in order to get the large title styling, `IonTitle` must have `size="large"`.

```tsx
import React from 'react';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonSearchbar,
  IonTitle,
  IonToolbar
} from '@ionic/react';

export const LargeTitleExample: React.FC = () => (
  <>
    <IonHeader translucent="true">
      <IonToolbar>
        <IonButtons collapse="true" slot="end">
          <IonButton>Click Me</IonButton>
        </IonButtons>
        <IonTitle>Settings</IonTitle>
      </IonToolbar>
    </IonHeader>

    <IonContent fullscreen="true">
      <IonHeader collapse="condense">
        <IonToolbar>
          <IonButtons collapse="true" slot="end">
            <IonButton>Click Me</IonButton>
          </IonButtons>
          <IonTitle size="large">Settings</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar></IonSearchbar>
        </IonToolbar>
      </IonHeader>

      ...

    </IonContent>
  </>
);
```

In this example, notice that we have added two sets of `IonButtons` both with `collapse` set to `true`. When the secondary header collapses, the buttons in the secondary header will hide, and the buttons in the primary header will show. This is useful for ensuring that your header buttons always appear next to an `IonTitle` element.

`IonButtons` elements that do not have `collapse` set will always be visible, regardless of collapsed state. When using the large title and `ion-buttons` elements inside of `ion-content`, the `ion-buttons` elements should always be placed in the `end` slot.

> When using collapsible large titles, it is required that `fullscreen` is set to `true` on `IonContent` and `translucent="true"` be set on the main `IonHeader`.

### Styling Collapsible Large Titles

The collapsible large title should appear seamless in relation to the rest of your content. This means that the background color of the `IonToolbar` that contains the collapsible large title should always match the background color of `IonContent`. 

By default, the `IonToolbar` that contains the standard title is hidden using `opacity: 0` and is progressively shown as you collapse the large title by scrolling. As a result, the background color that you see behind the standard title is actually the background color of `IonContent`.

You can change the background color of the toolbar with the standard title by setting the `--background` CSS variable on `IonToolbar`. This will give the effect of the header changing color as you collapse the large title.

When styling the text color of the large title, you should target the large title globally as opposed to within the context of a particular page or tab, otherwise its styles will not be applied during the navigation animation.

```css
ion-title.title-large {
  color: purple;
  font-size: 30px;
}
```