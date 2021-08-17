```html
<template>
  <!-- Data to display after skeleton screen -->
  <div v-if="data">
    <div class="ion-padding">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac eros est. Cras iaculis pulvinar arcu non vehicula. Fusce at quam a eros malesuada condimentum. Aliquam tincidunt tincidunt vehicula.
    </div>

    <ion-list>
      <ion-list-header>
        <ion-label>
          Data
        </ion-label>
      </ion-list-header>
      <ion-item>
        <ion-avatar slot="start">
          <img src="./avatar.svg">
        </ion-avatar>
        <ion-label>
          <h3>
            {{ data.heading }}
          </h3>
          <p>
            {{ data.para1 }}
          </p>
          <p>
            {{ data.para2 }}
          </p>
        </ion-label>
      </ion-item>
      <ion-item>
        <ion-thumbnail slot="start">
          <img src="./thumbnail.svg">
        </ion-thumbnail>
        <ion-label>
          <h3>
            {{ data.heading }}
          </h3>
          <p>
            {{ data.para1 }}
          </p>
          <p>
            {{ data.para2 }}
          </p>
        </ion-label>
      </ion-item>
      <ion-item>
        <ion-icon :icon="call" slot="start"></ion-icon>
        <ion-label>
          <h3>
            {{ data.heading }}
          </h3>
          <p>
            {{ data.para1 }}
          </p>
          <p>
            {{ data.para2 }}
          </p>
        </ion-label>
      </ion-item>
    </ion-list>
  </div>

  <!-- Skeleton screen -->
  <div v-if="!data">
    <div class="ion-padding custom-skeleton">
      <ion-skeleton-text animated style="width: 60%"></ion-skeleton-text>
      <ion-skeleton-text animated></ion-skeleton-text>
      <ion-skeleton-text animated style="width: 88%"></ion-skeleton-text>
      <ion-skeleton-text animated style="width: 70%"></ion-skeleton-text>
      <ion-skeleton-text animated style="width: 60%"></ion-skeleton-text>
    </div>

    <ion-list>
      <ion-list-header>
        <ion-label>
          <ion-skeleton-text animated style="width: 20%"></ion-skeleton-text>
        </ion-label>
      </ion-list-header>
      <ion-item>
        <ion-avatar slot="start">
          <ion-skeleton-text animated></ion-skeleton-text>
        </ion-avatar>
        <ion-label>
          <h3>
            <ion-skeleton-text animated style="width: 50%"></ion-skeleton-text>
          </h3>
          <p>
            <ion-skeleton-text animated style="width: 80%"></ion-skeleton-text>
          </p>
          <p>
            <ion-skeleton-text animated style="width: 60%"></ion-skeleton-text>
          </p>
        </ion-label>
      </ion-item>
      <ion-item>
        <ion-thumbnail slot="start">
          <ion-skeleton-text animated></ion-skeleton-text>
        </ion-thumbnail>
        <ion-label>
          <h3>
            <ion-skeleton-text animated style="width: 50%"></ion-skeleton-text>
          </h3>
          <p>
            <ion-skeleton-text animated style="width: 80%"></ion-skeleton-text>
          </p>
          <p>
            <ion-skeleton-text animated style="width: 60%"></ion-skeleton-text>
          </p>
        </ion-label>
      </ion-item>
      <ion-item>
        <ion-skeleton-text animated style="width: 27px; height: 27px" slot="start"></ion-skeleton-text>
        <ion-label>
          <h3>
            <ion-skeleton-text animated style="width: 50%"></ion-skeleton-text>
          </h3>
          <p>
            <ion-skeleton-text animated style="width: 80%"></ion-skeleton-text>
          </p>
          <p>
            <ion-skeleton-text animated style="width: 60%"></ion-skeleton-text>
          </p>
        </ion-label>
      </ion-item>
    </ion-list>
  </div>
</template>

<style>
  /* Custom Skeleton Line Height and Margin */
  .custom-skeleton ion-skeleton-text {
    line-height: 13px;
  }

  .custom-skeleton ion-skeleton-text:last-child {
    margin-bottom: 5px;
  }
</style>

<script>
import { 
  IonAvatar,
  IonIcon,
  IonItem, 
  IonLabel, 
  IonList, 
  IonListHeader,
  IonSkeletonText,
  IonThumbnail
} from '@ionic/vue';
import { call } from 'ionicons/icons';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  components: {
    IonAvatar,
    IonIcon,
    IonItem, 
    IonLabel, 
    IonList, 
    IonListHeader,
    IonSkeletonText,
    IonThumbnail
  },
  setup() {
    const data = ref();
    
    setTimeout(() => {
      data.value = {
        'heading': 'Normal text',
        'para1': 'Lorem ipsum dolor sit amet, consectetur',
        'para2': 'adipiscing elit.'
      };
    }, 5000);
    
    return { data }
  }
});
</script>
```