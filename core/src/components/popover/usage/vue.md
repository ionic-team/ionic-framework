### Inline Popover

```html
<template>
  <!-- Default -->
  <ion-popover :is-open="true">
    <ion-content>Popover Content</ion-content>
  </ion-popover>
  
  <!-- No Arrow -->
  <ion-popover :is-open="true" :arrow="false">
    <ion-content>Popover Content</ion-content>
  </ion-popover>
  
  <!-- Use a trigger -->
  <ion-button id="trigger-button">Click to open popover</ion-button>
  <ion-popover trigger="trigger-button">
    <ion-content>Popover Content</ion-content>
  </ion-popover>
  
  <!-- Hover over trigger to open -->
  <ion-button id="hover-button">Hover to open popover</ion-button>
  <ion-popover trigger="hover-button" trigger-action="hover">
    <ion-content>Popover Content</ion-content>
  </ion-popover>
  
  <!-- Show popover above trigger -->
  <ion-button id="side-button">Click to open popover</ion-button>
  <ion-popover trigger="side-button" side="top">
    <ion-content>Popover Content</ion-content>
  </ion-popover>
  
  <!-- Align popover to end of trigger -->
  <ion-button id="alignment-button">Click to open popover</ion-button>
  <ion-popover trigger="alignment-button" side="top" alignment="end">
    <ion-content>Popover Content</ion-content>
  </ion-popover>
  
  <!-- Make popover the same size as the trigger -->
  <ion-button id="size-button">Click to open popover</ion-button>
  <ion-popover trigger="size-button" size="cover">
    <ion-content>Popover Content</ion-content>
  </ion-popover>
  
  <!-- Make popover show relative to click coordinates rather than trigger -->
  <ion-button id="size-button">Click to open popover</ion-button>
  <ion-popover trigger="size-button" reference="event">
    <ion-content>Popover Content</ion-content>
  </ion-popover>
  
  <!-- Nested Popover -->
  <ion-button id="nested-button">Click to open popover</ion-button>
  <ion-popover trigger="nested-button" :dismiss-on-select="true">
    <ion-content>
      <ion-list>
        <ion-item :button="true" :detail="false">
          <ion-label>Option 1</ion-label>
        </ion-item>
        <ion-item :button="true" :detail="false">
          <ion-label>Option 2</ion-label>
        </ion-item>
        <ion-item :button="true" :detail="true" id="nested-trigger">
          <ion-label>Option 3</ion-label>
        </ion-item>
        
        <ion-popover trigger="nested-trigger" :dismiss-on-select="true" side="end">
          <ion-content>
            <ion-item :button="true">
              <ion-label>Nested Option</ion-label>
            </ion-item>
          </ion-content>
        </ion-popover>
      </ion-list>
    </ion-content>
  </ion-popover>
</template>

<script>
import { IonButton, IonContent, IonItem, IonLabel, IonPopover } from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: { IonButton, IonContent, IonItem, IonLabel, IonPopover }
});
</script>
```


### Inline Popover with State

```html
<template>
  <ion-button @click="setOpen(true, $event)">Show Popover</ion-button>
  <ion-popover
    :is-open="isOpenRef"
    css-class="my-custom-class"
    :event="event"
    :translucent="true"
    @didDismiss="setOpen(false)"
  >
    <Popover></Popover>
  </ion-popover>
</template>

<script>
import { IonButton, IonPopover } from '@ionic/vue';
import { defineComponent, ref } from 'vue';
import Popover from './popover.vue';

export default defineComponent({
  components: { IonButton, IonPopover, Popover },
  setup() {
    const isOpenRef = ref(false);
    const event = ref();
    const setOpen = (state: boolean, ev?: Event) => {
      event.value = ev; 
      isOpenRef.value = state;
    }
    return { isOpenRef, setOpen, event }
  }
});
</script>
```

### Popover Controller

```html
<template>
  <ion-content class="ion-padding">
    Popover Content
  </ion-content>
</template>

<script>
import { IonContent } from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Popover',
  components: { IonContent }
});
</script>
```

```html
<template>
  <ion-page>
    <ion-content class="ion-padding">
      <ion-button @click="openPopover">Open Popover</ion-button>
    </ion-content>
  </ion-page>
</template>

<script>
import { IonButton, IonContent, IonPage, popoverController } from '@ionic/vue';
import Popover from './popover.vue';

export default {
  components: { IonButton, IonContent, IonPage },
  methods: {
    async openPopover(ev: Event) {
      const popover = await popoverController
        .create({
          component: Popover,
          cssClass: 'my-custom-class',
          event: ev,
          translucent: true
        })
      await popover.present();

      const { role } = await popover.onDidDismiss();
      console.log('onDidDismiss resolved with role', role);
    },
  },
}
</script>
```