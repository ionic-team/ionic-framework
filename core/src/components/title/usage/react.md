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
        <IonButtons collapse="true">
          <IonButton>Click Me</IonButton>
        </IonButtons> 
        <IonTitle>Settings</IonTitle>               
      </IonToolbar>
    </IonHeader>
    
    <IonContent fullscreen="true">
      <IonHeader collapse="condense">              
        <IonToolbar>      
          <IonButtons collapse="true">
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

In this example, notice that we have added two sets of `IonButtons` both with `collapse="true"`. When the secondary header collapses, the buttons in the secondary header will hide, and the buttons in the primary header will show. This is useful for ensuring that your header buttons always appear next to an `IonTitle` element.

`IonButtons` elements that do not have `collapse` set will always be visible, regardless of collapsed state.

When styling the large title, you should target the large title globally as opposed to within the context of a particular page or tab, otherwise its styles will not be applied during the navigation animation.

```css
ion-title.large-title {
  color: purple;
  font-size: 30px;
}
```

> When using collapsible large titles, it is required that `fullscreen="true"` be set on `IonContent` and `translucent="true"` be set on the main `IonHeader`.