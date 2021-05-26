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
        <ion-icon :icon="add"></ion-icon>
      </ion-fab-button>
    </ion-fab>

    <!-- fab placed to the bottom end -->
    <ion-fab vertical="bottom" horizontal="end" slot="fixed">
      <ion-fab-button>
        <ion-icon :icon="arrowForwardCircle"></ion-icon>
      </ion-fab-button>
    </ion-fab>

    <!-- fab placed to the top start -->
    <ion-fab vertical="top" horizontal="start" slot="fixed">
      <ion-fab-button>
        <ion-icon :icon="arrowBackCircle"></ion-icon>
      </ion-fab-button>
    </ion-fab>

    <!-- fab placed to the bottom start -->
    <ion-fab vertical="bottom" horizontal="start" slot="fixed">
      <ion-fab-button>
        <ion-icon :icon="arrowUpCircle"></ion-icon>
      </ion-fab-button>
    </ion-fab>

    <!-- fab placed to the (vertical) center and start -->
    <ion-fab vertical="center" horizontal="start" slot="fixed">
      <ion-fab-button>
        <ion-icon :icon="share"></ion-icon>
      </ion-fab-button>
    </ion-fab>

    <!-- fab placed to the (vertical) center and end -->
    <ion-fab vertical="center" horizontal="end" slot="fixed">
      <ion-fab-button>
        <ion-icon :icon="add"></ion-icon>
      </ion-fab-button>
    </ion-fab>

    <!-- fab placed to the top and end and on the top edge of the content overlapping header -->
    <ion-fab vertical="top" horizontal="end" edge slot="fixed">
      <ion-fab-button>
        <ion-icon :icon="person"></ion-icon>
      </ion-fab-button>
    </ion-fab>

    <!-- fab placed to the bottom and start and on the bottom edge of the content overlapping footer with a list to the right -->
    <ion-fab vertical="bottom" horizontal="start" edge slot="fixed">
      <ion-fab-button>
        <ion-icon :icon="settings"></ion-icon>
      </ion-fab-button>
      <ion-fab-list side="end">
        <ion-fab-button><ion-icon :icon="logoVimeo"></ion-icon></ion-fab-button>
      </ion-fab-list>
    </ion-fab>

    <!-- fab placed in the center of the content with a list on each side -->
    <ion-fab vertical="center" horizontal="center" slot="fixed">
      <ion-fab-button>
        <ion-icon :icon="share"></ion-icon>
      </ion-fab-button>
      <ion-fab-list side="top">
        <ion-fab-button><ion-icon :icon="logoVimeo"></ion-icon></ion-fab-button>
      </ion-fab-list>
      <ion-fab-list side="bottom">
        <ion-fab-button><ion-icon :icon="logoFacebook"></ion-icon></ion-fab-button>
      </ion-fab-list>
      <ion-fab-list side="start">
        <ion-fab-button><ion-icon :icon="logoInstagram"></ion-icon></ion-fab-button>
      </ion-fab-list>
      <ion-fab-list side="end">
        <ion-fab-button><ion-icon :icon="logoTwitter"></ion-icon></ion-fab-button>
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
  arrowUpCircle,
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
      arrowUpCircle,
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
