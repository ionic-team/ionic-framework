### Inline Modal

```html
<!-- Default -->
<ion-modal :is-open="true">
  <ion-content>Modal Content</ion-content>
</ion-modal>

<!-- Use a trigger -->
<ion-button id="trigger-button">Click to open modal</ion-button>
<ion-modal trigger="trigger-button">
  <ion-content>Modal Content</ion-content>
</ion-modal>

<!-- Sheet Modal -->
<ion-modal 
  :is-open="true"
  :breakpoints="[0.1, 0.5, 1]"
  :initialBreakpoint="0.5"
>
  <ion-content>Modal Content</ion-content>
</ion-modal>

<!-- Card Modal -->
<ion-modal
  :is-open="true"
  :swipe-to-close="true"
  :presenting-element="$parent.$refs.ionRouterOutlet"
>
  <ion-content>Modal Content</ion-content>
</ion-modal>

<!-- Passing Props -->
<ion-modal :is-open="true">
  <app-vue-component title="Ionic"></app-vue-component>
</ion-modal>

<!-- Require Action Sheet confirmation before dismissing -->
<ion-modal
  :is-open="true"
  :can-dismiss="canDismiss"
>
  <ion-content>Modal Content</ion-content>
</ion-modal>

<script>
  import { IonModal, IonButton, IonContent } from '@ionic/vue';
  import { defineComponent } from 'vue';
  import AppVueComponent from './AppVueComponent.vue'
  
  export default defineComponent({
    components: { IonModal, IonButton, IonContent, AppVueComponent },
    setup() {
      const canDismiss = async () => {
        const actionSheet = await actionSheetController.create({
          header: 'Are you sure you want to discard your changes?',
          buttons: [
            {
              text: 'Discard Changes',
              role: 'destructive'
            },
            {
              text: 'Keep Editing',
              role: 'cancel'
            }
          ]
        });
        
        await actionSheet.present();
        
        const { role } = await actionSheet.onDidDismiss();
        
        if (role === 'destructive') {
          return true;
        }
        
        return false;
      };
      
      return { canDismiss }
    }
  });
</script>
```

### Modal Controller

```html
<template>
  <ion-header>
    <ion-toolbar>
      <ion-title>{{ title }}</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
    {{ content }}
  </ion-content>
</template>

<script>
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Modal',
  props: {
    title: { type: String, default: 'Super Modal' },
  },
  data() {
    return {
      content: 'Content',
    }
  },
  components: { IonContent, IonHeader, IonTitle, IonToolbar }
});
</script>
```

```html
<template>
  <ion-page>
    <ion-content class="ion-padding">
      <ion-button @click="openModal">Open Modal</ion-button>
    </ion-content>
  </ion-page>
</template>

<script>
import { IonButton, IonContent, IonPage, modalController } from '@ionic/vue';
import Modal from './modal.vue'

export default {
  components: { IonButton, IonContent, IonPage },
  methods: {
    async openModal() {
      const modal = await modalController
        .create({
          component: Modal,
          cssClass: 'my-custom-class',
          componentProps: {
            title: 'New Title'
          },
        })
      return modal.present();
    },
  },
}
</script>
```

Developers can also use this component directly in their template:

```html
<template>
  <ion-button @click="setOpen(true)">Show Modal</ion-button>
  <ion-modal
    :is-open="isOpenRef"
    css-class="my-custom-class"
    @didDismiss="setOpen(false)"
  >
    <Modal :data="data"></Modal>
  </ion-modal>
</template>

<script>
import { IonModal, IonButton } from '@ionic/vue';
import { defineComponent, ref } from 'vue';
import Modal from './modal.vue'

export default defineComponent({
  components: { IonModal, IonButton, Modal },
  setup() {
    const isOpenRef = ref(false);
    const setOpen = (state: boolean) => isOpenRef.value = state;
    const data = { content: 'New Content' };
    return { isOpenRef, setOpen, data }
  }
});
</script>
```

> If you need a wrapper element inside of your modal component, we recommend using an `<ion-page>` so that the component dimensions are still computed properly.

#### Card Modals

Modals in iOS mode have the ability to be presented in a card-style and swiped to close. The card-style presentation and swipe to close gesture are not mutually exclusive, meaning you can pick and choose which features you want to use. For example, you can have a card-style modal that cannot be swiped or a full sized modal that can be swiped.

> Card style modals when running on iPhone-sized devices do not have backdrops. As a result, the `--backdrop-opacity` variable will not have any effect.

```html
<template>
  <ion-page>
    <ion-content>
      <ion-button @click="setOpen(true)">Show Modal</ion-button>
      <ion-modal
        :is-open="isOpenRef"
        css-class="my-custom-class"
        :swipe-to-close="true"
        :presenting-element="$parent.$refs.ionRouterOutlet"
        @didDismiss="setOpen(false)"
      >
        <Modal :data="data"></Modal>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonModal, IonButton, IonContent, IonPage } from '@ionic/vue';
import { defineComponent, ref } from 'vue';
import Modal from './modal.vue'

export default defineComponent({
  components: { IonModal, IonButton, Modal, IonContent, IonPage },
  setup() {
    const isOpenRef = ref(false);
    const setOpen = (state: boolean) => isOpenRef.value = state;
    const data = { content: 'New Content' };
    return { isOpenRef, setOpen, data }
  }
});
</script>
```

#### Sheet Modals

```html
<template>
  <ion-page>
    <ion-content class="ion-padding">
      <ion-button @click="openModal()">Open Modal</ion-button>
    </ion-content>
  </ion-page>
</template>

<script>
import { IonButton, IonContent, IonPage, modalController } from '@ionic/vue';
import Modal from './modal.vue'

export default {
  components: { IonButton, IonContent, IonPage },
  methods: {
    async openModal() {
      const modal = await modalController
        .create({
          component: Modal,
          initialBreakpoint: 0.5,
          breakpoints: [0, 0.5, 1]
        })
      return modal.present();
    },
  },
}
</script>
```