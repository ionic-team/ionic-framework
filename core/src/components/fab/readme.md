# ion-fab

Fabs are container elements that contain one or more fab buttons. They should be placed in a fixed position that does not scroll with the content. Fab should have one main fab-button. Fabs can also contain fab-lists which contain related buttons that show when the main fab button is clicked. The same fab container can contain several [fab-list](../fab-list) elements with different side values.

<!-- Auto Generated Below -->


## Usage

### Angular / javascript

```html
<ion-header>
  <ion-toolbar>
    <ion-title>Header</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content>
  <!-- fab placed to the top end -->
  <ion-fab vertical="top" horizontal="end" slot="fixed">
    <ion-fab-button>
      <ion-icon name="add"></ion-icon>
    </ion-fab-button>
  </ion-fab>

  <!-- fab placed to the bottom end -->
  <ion-fab vertical="bottom" horizontal="end" slot="fixed">
    <ion-fab-button>
      <ion-icon name="arrow-forward-circle"></ion-icon>
    </ion-fab-button>
  </ion-fab>

  <!-- fab placed to the top start -->
  <ion-fab vertical="top" horizontal="start" slot="fixed">
    <ion-fab-button>
      <ion-icon name="arrow-back-circle"></ion-icon>
    </ion-fab-button>
  </ion-fab>

  <!-- fab placed to the bottom start -->
  <ion-fab vertical="bottom" horizontal="start" slot="fixed">
    <ion-fab-button>
      <ion-icon name="arrow-up-circle"></ion-icon>
    </ion-fab-button>
  </ion-fab>

  <!-- fab placed to the (vertical) center and start -->
  <ion-fab vertical="center" horizontal="start" slot="fixed">
    <ion-fab-button>
      <ion-icon name="share"></ion-icon>
    </ion-fab-button>
  </ion-fab>

  <!-- fab placed to the (vertical) center and end -->
  <ion-fab vertical="center" horizontal="end" slot="fixed">
    <ion-fab-button>
      <ion-icon name="add"></ion-icon>
    </ion-fab-button>
  </ion-fab>

  <!-- fab placed to the top and end and on the top edge of the content overlapping header -->
  <ion-fab vertical="top" horizontal="end" edge slot="fixed">
    <ion-fab-button>
      <ion-icon name="person"></ion-icon>
    </ion-fab-button>
  </ion-fab>

  <!-- fab placed to the bottom and start and on the bottom edge of the content overlapping footer with a list to the right -->
  <ion-fab vertical="bottom" horizontal="start" edge slot="fixed">
    <ion-fab-button>
      <ion-icon name="settings"></ion-icon>
    </ion-fab-button>
    <ion-fab-list side="end">
      <ion-fab-button><ion-icon name="logo-vimeo"></ion-icon></ion-fab-button>
    </ion-fab-list>
  </ion-fab>

  <!-- fab placed in the center of the content with a list on each side -->
  <ion-fab vertical="center" horizontal="center" slot="fixed">
    <ion-fab-button>
      <ion-icon name="share"></ion-icon>
    </ion-fab-button>
    <ion-fab-list side="top">
      <ion-fab-button><ion-icon name="logo-vimeo"></ion-icon></ion-fab-button>
    </ion-fab-list>
    <ion-fab-list side="bottom">
      <ion-fab-button><ion-icon name="logo-facebook"></ion-icon></ion-fab-button>
    </ion-fab-list>
    <ion-fab-list side="start">
      <ion-fab-button><ion-icon name="logo-instagram"></ion-icon></ion-fab-button>
    </ion-fab-list>
    <ion-fab-list side="end">
      <ion-fab-button><ion-icon name="logo-twitter"></ion-icon></ion-fab-button>
    </ion-fab-list>
  </ion-fab>
</ion-content>

<ion-footer>
  <ion-toolbar>
    <ion-title>Footer</ion-title>
  </ion-toolbar>
</ion-footer>
```


### React

```tsx
import React from 'react';
import { IonContent, IonHeader, IonFooter, IonPage, IonTitle, IonToolbar, IonFab, IonFabButton, IonIcon, IonFabList } from '@ionic/react';
import { add, settings, share, person, arrowForwardCircle, arrowBackCircle, arrowUpCircle, logoVimeo, logoFacebook, logoInstagram, logoTwitter } from 'ionicons/icons';

export const FabExamples: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Header</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {/*-- fab placed to the top end --*/}
        <IonFab vertical="top" horizontal="end" slot="fixed">
          <IonFabButton>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

        {/*-- fab placed to the bottom end --*/}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton>
            <IonIcon icon={arrowForwardCircle} />
          </IonFabButton>
        </IonFab>

        {/*-- fab placed to the top start --*/}
        <IonFab vertical="top" horizontal="start" slot="fixed">
          <IonFabButton>
            <IonIcon icon={arrowBackCircle} />
          </IonFabButton>
        </IonFab>

        {/*-- fab placed to the bottom start --*/}
        <IonFab vertical="bottom" horizontal="start" slot="fixed">
          <IonFabButton>
            <IonIcon icon={arrowUpCircle} />
          </IonFabButton>
        </IonFab>

        {/*-- fab placed to the (vertical) center and start --*/}
        <IonFab vertical="center" horizontal="start" slot="fixed">
          <IonFabButton>
            <IonIcon icon={share} />
          </IonFabButton>
        </IonFab>

        {/*-- fab placed to the (vertical) center and end --*/}
        <IonFab vertical="center" horizontal="end" slot="fixed">
          <IonFabButton>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

        {/*-- fab placed to the top and end and on the top edge of the content overlapping header --*/}
        <IonFab vertical="top" horizontal="end" edge slot="fixed">
          <IonFabButton>
            <IonIcon icon={person} />
          </IonFabButton>
        </IonFab>

        {/*-- fab placed to the bottom and start and on the bottom edge of the content overlapping footer with a list to the right --*/}
        <IonFab vertical="bottom" horizontal="start" edge slot="fixed">
          <IonFabButton>
            <IonIcon icon={settings} />
          </IonFabButton>
          <IonFabList side="end">
            <IonFabButton><IonIcon icon={logoVimeo} /></IonFabButton>
          </IonFabList>
        </IonFab>

        {/*-- fab placed in the center of the content with a list on each side --*/}
        <IonFab vertical="center" horizontal="center" slot="fixed">
          <IonFabButton>
            <IonIcon icon={share} />
          </IonFabButton>
          <IonFabList side="top">
            <IonFabButton><IonIcon icon={logoVimeo} /></IonFabButton>
          </IonFabList>
          <IonFabList side="bottom">
            <IonFabButton><IonIcon icon={logoFacebook} /></IonFabButton>
          </IonFabList>
          <IonFabList side="start">
            <IonFabButton><IonIcon icon={logoInstagram} /></IonFabButton>
          </IonFabList>
          <IonFabList side="end">
            <IonFabButton><IonIcon icon={logoTwitter} /></IonFabButton>
          </IonFabList>
        </IonFab>
      </IonContent>
      <IonFooter>
        <IonToolbar>
          <IonTitle>Footer</IonTitle>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};
```


### Stencil

```tsx
import { Component, h } from '@stencil/core';

@Component({
  tag: 'fab-example',
  styleUrl: 'fab-example.css'
})
export class FabExample {
  render() {
    return [
      <ion-header>
        <ion-toolbar>
          <ion-title>Header</ion-title>
        </ion-toolbar>
      </ion-header>,

      <ion-content>
        {/* fab placed to the top end */}
        <ion-fab vertical="top" horizontal="end" slot="fixed">
          <ion-fab-button>
            <ion-icon name="add"></ion-icon>
          </ion-fab-button>
        </ion-fab>

        {/* fab placed to the bottom end */}
        <ion-fab vertical="bottom" horizontal="end" slot="fixed">
          <ion-fab-button>
            <ion-icon name="arrow-forward-circle"></ion-icon>
          </ion-fab-button>
        </ion-fab>

        {/* fab placed to the top start */}
        <ion-fab vertical="top" horizontal="start" slot="fixed">
          <ion-fab-button>
            <ion-icon name="arrow-back-circle"></ion-icon>
          </ion-fab-button>
        </ion-fab>

        {/* fab placed to the bottom start */}
        <ion-fab vertical="bottom" horizontal="start" slot="fixed">
          <ion-fab-button>
            <ion-icon name="arrow-up-circle"></ion-icon>
          </ion-fab-button>
        </ion-fab>

        {/* fab placed to the (vertical) center and start */}
        <ion-fab vertical="center" horizontal="start" slot="fixed">
          <ion-fab-button>
            <ion-icon name="share"></ion-icon>
          </ion-fab-button>
        </ion-fab>

        {/* fab placed to the (vertical) center and end */}
        <ion-fab vertical="center" horizontal="end" slot="fixed">
          <ion-fab-button>
            <ion-icon name="add"></ion-icon>
          </ion-fab-button>
        </ion-fab>

        {/* fab placed to the top and end and on the top edge of the  content overlapping header */}
        <ion-fab vertical="top" horizontal="end" edge slot="fixed">
          <ion-fab-button>
            <ion-icon name="person"></ion-icon>
          </ion-fab-button>
        </ion-fab>

        {/* fab placed to the bottom and start and on the bottom edge of content  overlapping footer with a list to the right */}
        <ion-fab vertical="bottom" horizontal="start" edge slot="fixed">
          <ion-fab-button>
            <ion-icon name="settings"></ion-icon>
          </ion-fab-button>
          <ion-fab-list side="end">
            <ion-fab-button><ion-icon name="logo-vimeo"></ion-icon></ion-fab-button>
          </ion-fab-list>
        </ion-fab>

        {/* fab placed in the center of the content with a list on each side */}
        <ion-fab vertical="center" horizontal="center" slot="fixed">
          <ion-fab-button>
            <ion-icon name="share"></ion-icon>
          </ion-fab-button>
          <ion-fab-list side="top">
            <ion-fab-button><ion-icon name="logo-vimeo"></ion-icon></ion-fab-button>
          </ion-fab-list>
          <ion-fab-list side="bottom">
            <ion-fab-button><ion-icon name="logo-facebook"></ion-icon></ion-fab-button>
          </ion-fab-list>
          <ion-fab-list side="start">
            <ion-fab-button><ion-icon name="logo-instagram"></ion-icon></ion-fab-button>
          </ion-fab-list>
          <ion-fab-list side="end">
            <ion-fab-button><ion-icon name="logo-twitter"></ion-icon></ion-fab-button>
          </ion-fab-list>
        </ion-fab>
      </ion-content>,

      <ion-footer>
        <ion-toolbar>
          <ion-title>
            Footer
          </ion-title>
        </ion-toolbar>
      </ion-footer>
    ];
  }
}
```


### Vue

```html
<template>
  <ion-header>
    <ion-toolbar>
      <ion-title>Header</ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content>
    <!-- fab placed to the top end -->
    <ion-fab vertical="top" horizontal="end" slot="fixed">
      <ion-fab-button>
        <ion-icon name="add"></ion-icon>
      </ion-fab-button>
    </ion-fab>

    <!-- fab placed to the bottom end -->
    <ion-fab vertical="bottom" horizontal="end" slot="fixed">
      <ion-fab-button>
        <ion-icon name="arrow-forward-circle"></ion-icon>
      </ion-fab-button>
    </ion-fab>

    <!-- fab placed to the top start -->
    <ion-fab vertical="top" horizontal="start" slot="fixed">
      <ion-fab-button>
        <ion-icon name="arrow-back-circle"></ion-icon>
      </ion-fab-button>
    </ion-fab>

    <!-- fab placed to the bottom start -->
    <ion-fab vertical="bottom" horizontal="start" slot="fixed">
      <ion-fab-button>
        <ion-icon name="arrow-up-circle"></ion-icon>
      </ion-fab-button>
    </ion-fab>

    <!-- fab placed to the (vertical) center and start -->
    <ion-fab vertical="center" horizontal="start" slot="fixed">
      <ion-fab-button>
        <ion-icon name="share"></ion-icon>
      </ion-fab-button>
    </ion-fab>

    <!-- fab placed to the (vertical) center and end -->
    <ion-fab vertical="center" horizontal="end" slot="fixed">
      <ion-fab-button>
        <ion-icon name="add"></ion-icon>
      </ion-fab-button>
    </ion-fab>

    <!-- fab placed to the top and end and on the top edge of the content overlapping header -->
    <ion-fab vertical="top" horizontal="end" edge slot="fixed">
      <ion-fab-button>
        <ion-icon name="person"></ion-icon>
      </ion-fab-button>
    </ion-fab>

    <!-- fab placed to the bottom and start and on the bottom edge of the content overlapping footer with a list to the right -->
    <ion-fab vertical="bottom" horizontal="start" edge slot="fixed">
      <ion-fab-button>
        <ion-icon name="settings"></ion-icon>
      </ion-fab-button>
      <ion-fab-list side="end">
        <ion-fab-button><ion-icon name="logo-vimeo"></ion-icon></ion-fab-button>
      </ion-fab-list>
    </ion-fab>

    <!-- fab placed in the center of the content with a list on each side -->
    <ion-fab vertical="center" horizontal="center" slot="fixed">
      <ion-fab-button>
        <ion-icon name="share"></ion-icon>
      </ion-fab-button>
      <ion-fab-list side="top">
        <ion-fab-button><ion-icon name="logo-vimeo"></ion-icon></ion-fab-button>
      </ion-fab-list>
      <ion-fab-list side="bottom">
        <ion-fab-button><ion-icon name="logo-facebook"></ion-icon></ion-fab-button>
      </ion-fab-list>
      <ion-fab-list side="start">
        <ion-fab-button><ion-icon name="logo-instagram"></ion-icon></ion-fab-button>
      </ion-fab-list>
      <ion-fab-list side="end">
        <ion-fab-button><ion-icon name="logo-twitter"></ion-icon></ion-fab-button>
      </ion-fab-list>
    </ion-fab>
  </ion-content>

  <ion-footer>
    <ion-toolbar>
      <ion-title>Footer</ion-title>
    </ion-toolbar>
  </ion-footer>
</template>

<script>
import { 
  IonContent, 
  IonFab, 
  IonFabButton, 
  IonFabList, 
  IonFooter, 
  IonHeader, 
  IonIcon, 
  IonTitle, 
  IonToolbar 
} from '@ionic/vue';
import { 
  add, 
  arrowBackCircle,
  arrowForwardCircle, 
  logoFacebook, 
  logoInstagram, 
  logoTwitter, 
  logoVimeo, 
  person, 
  settings, 
  share
} from 'ionicons/icons';
import { defineComponent } from 'vue';

export default defineComponent({
  components: { 
    IonContent, 
    IonFab, 
    IonFabButton, 
    IonFabList, 
    IonFooter, 
    IonHeader, 
    IonIcon, 
    IonTitle, 
    IonToolbar
  },
  setup() {
    return {
      add, 
      arrowBackCircle,
      arrowForwardCircle, 
      logoFacebook, 
      logoInstagram, 
      logoTwitter, 
      logoVimeo, 
      person, 
      settings, 
      share
    }
  }
});
</script>
```



## Properties

| Property     | Attribute    | Description                                                                                                                                                                                     | Type                                         | Default     |
| ------------ | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- | ----------- |
| `activated`  | `activated`  | If `true`, both the `ion-fab-button` and all `ion-fab-list` inside `ion-fab` will become active. That means `ion-fab-button` will become a `close` icon and `ion-fab-list` will become visible. | `boolean`                                    | `false`     |
| `edge`       | `edge`       | If `true`, the fab will display on the edge of the header if `vertical` is `"top"`, and on the edge of the footer if it is `"bottom"`. Should be used with a `fixed` slot.                      | `boolean`                                    | `false`     |
| `horizontal` | `horizontal` | Where to align the fab horizontally in the viewport.                                                                                                                                            | `"center" \| "end" \| "start" \| undefined`  | `undefined` |
| `vertical`   | `vertical`   | Where to align the fab vertically in the viewport.                                                                                                                                              | `"bottom" \| "center" \| "top" \| undefined` | `undefined` |


## Methods

### `close() => Promise<void>`

Close an active FAB list container.

#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
