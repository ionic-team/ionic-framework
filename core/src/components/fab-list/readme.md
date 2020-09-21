# ion-fab-list

The `ion-fab-list` element is a container for multiple fab buttons. This collection of fab buttons contains actions related to the main fab button and is flung out on click. To specify what side the buttons should appear on, set the `side` property to 'start', 'end', 'top', 'bottom'

<!-- Auto Generated Below -->


## Usage

### Angular / javascript

```html
<ion-fab vertical="center" horizontal="center">
  <ion-fab-button>Share</ion-fab-button>
  <ion-fab-list side="top">
    <ion-fab-button>
      <ion-icon name="logo-facebook"></ion-icon>
    </ion-fab-button>
    <ion-fab-button>
      <ion-icon name="logo-twitter"></ion-icon>
    </ion-fab-button>
    <ion-fab-button>
      <ion-icon name="logo-youtube"></ion-icon>
    </ion-fab-button>
  </ion-fab-list>

  <ion-fab-list side="end">
    <ion-fab-button>
      <ion-icon name="logo-pwa"></ion-icon>
    </ion-fab-button>
    <ion-fab-button>
      <ion-icon name="logo-npm"></ion-icon>
    </ion-fab-button>
    <ion-fab-button>
      <ion-icon name="logo-ionic"></ion-icon>
    </ion-fab-button>
  </ion-fab-list>

  <ion-fab-list side="bottom">
    <ion-fab-button>
      <ion-icon name="logo-github"></ion-icon>
    </ion-fab-button>
    <ion-fab-button>
      <ion-icon name="logo-javascript"></ion-icon>
    </ion-fab-button>
    <ion-fab-button>
      <ion-icon name="logo-angular"></ion-icon>
    </ion-fab-button>
  </ion-fab-list>

  <ion-fab-list side="start">
    <ion-fab-button>
      <ion-icon name="logo-vimeo"></ion-icon>
    </ion-fab-button>
    <ion-fab-button>
      <ion-icon name="logo-chrome"></ion-icon>
    </ion-fab-button>
    <ion-fab-button>
      <ion-icon name="logo-react"></ion-icon>
    </ion-fab-button>
  </ion-fab-list>
</ion-fab>
```


### React

```tsx
import React from 'react';
import { IonFab, IonFabButton, IonFabList, IonContent, IonIcon } from '@ionic/react';
import { logoFacebook, logoTwitter, logoYoutube, logoPwa, logoNpm, logoIonic, logoGithub, logoJavascript, logoAngular, logoVimeo, logoChrome, logoReact } from 'ionicons/icons';

export const FabListExample: React.FC = () => (
  <IonContent>
    <IonFab vertical="center" horizontal="center">
      <IonFabButton>Share</IonFabButton>
      <IonFabList side="top">
        <IonFabButton>
          <IonIcon icon={logoFacebook} />
        </IonFabButton>
        <IonFabButton>
          <IonIcon icon={logoTwitter} />
        </IonFabButton>
        <IonFabButton>
          <IonIcon icon={logoYoutube} />
        </IonFabButton>
      </IonFabList>

      <IonFabList side="end">
        <IonFabButton>
          <IonIcon icon={logoPwa} />
        </IonFabButton>
        <IonFabButton>
          <IonIcon icon={logoNpm} />
        </IonFabButton>
        <IonFabButton>
          <IonIcon icon={logoIonic} />
        </IonFabButton>
      </IonFabList>

      <IonFabList side="bottom">
        <IonFabButton>
          <IonIcon icon={logoGithub} />
        </IonFabButton>
        <IonFabButton>
          <IonIcon icon={logoJavascript} />
        </IonFabButton>
        <IonFabButton>
          <IonIcon icon={logoAngular} />
        </IonFabButton>
      </IonFabList>

      <IonFabList side="start">
        <IonFabButton>
          <IonIcon icon={logoVimeo} />
        </IonFabButton>
        <IonFabButton>
          <IonIcon icon={logoChrome} />
        </IonFabButton>
        <IonFabButton>
          <IonIcon icon={logoReact} />
        </IonFabButton>
      </IonFabList>
    </IonFab>
  </IonContent>
);

```


### Stencil

```tsx
import { Component, h } from '@stencil/core';

@Component({
  tag: 'fab-list-example',
  styleUrl: 'fab-list-example.css'
})
export class FabListExample {
  render() {
    return [
      <ion-fab vertical="center" horizontal="center">
        <ion-fab-button>Share</ion-fab-button>
        <ion-fab-list side="top">
          <ion-fab-button>
            <ion-icon name="logo-facebook"></ion-icon>
          </ion-fab-button>
          <ion-fab-button>
            <ion-icon name="logo-twitter"></ion-icon>
          </ion-fab-button>
          <ion-fab-button>
            <ion-icon name="logo-youtube"></ion-icon>
          </ion-fab-button>
        </ion-fab-list>

        <ion-fab-list side="end">
          <ion-fab-button>
            <ion-icon name="logo-pwa"></ion-icon>
          </ion-fab-button>
          <ion-fab-button>
            <ion-icon name="logo-npm"></ion-icon>
          </ion-fab-button>
          <ion-fab-button>
            <ion-icon name="logo-ionic"></ion-icon>
          </ion-fab-button>
        </ion-fab-list>

        <ion-fab-list side="bottom">
          <ion-fab-button>
            <ion-icon name="logo-github"></ion-icon>
          </ion-fab-button>
          <ion-fab-button>
            <ion-icon name="logo-javascript"></ion-icon>
          </ion-fab-button>
          <ion-fab-button>
            <ion-icon name="logo-angular"></ion-icon>
          </ion-fab-button>
        </ion-fab-list>

        <ion-fab-list side="start">
          <ion-fab-button>
            <ion-icon name="logo-vimeo"></ion-icon>
          </ion-fab-button>
          <ion-fab-button>
            <ion-icon name="logo-chrome"></ion-icon>
          </ion-fab-button>
          <ion-fab-button>
            <ion-icon name="logo-react"></ion-icon>
          </ion-fab-button>
        </ion-fab-list>
      </ion-fab>
    ];
  }
}
```


### Vue

```html
<template>
  <ion-fab vertical="bottom" horizontal="end">
    <ion-fab-button>Share</ion-fab-button>

    <ion-fab-list side="top">
      <ion-fab-button>Facebook</ion-fab-button>
      <ion-fab-button>Twitter</ion-fab-button>
      <ion-fab-button>Youtube</ion-fab-button>
    </ion-fab-list>

    <ion-fab-list side="start">
      <ion-fab-button>Vimeo</ion-fab-button>
    </ion-fab-list>

  </ion-fab>
</template>

<script>
import { IonFab, IonFabButton, IonFabList } from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: { IonFab, IonFabButton, IonFabList }
});
</script>
```



## Properties

| Property    | Attribute   | Description                                                         | Type                                    | Default    |
| ----------- | ----------- | ------------------------------------------------------------------- | --------------------------------------- | ---------- |
| `activated` | `activated` | If `true`, the fab list will show all fab buttons in the list.      | `boolean`                               | `false`    |
| `side`      | `side`      | The side the fab list will show on relative to the main fab button. | `"bottom" \| "end" \| "start" \| "top"` | `'bottom'` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
