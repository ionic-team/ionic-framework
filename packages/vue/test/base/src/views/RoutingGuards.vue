<template>
  <ion-page data-pageid="routing-guards">
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/routing"></ion-back-button>
        </ion-buttons>
        <ion-title>Routing Guards</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <h2>beforeRouteEnter next() callback</h2>
      <p>
        This page's <code>beforeRouteEnter</code> guard calls
        <code>next((vm) =&gt; { vm.member = 5 })</code>.
      </p>
      <p>
        Expected <code>member</code> value: <strong>5</strong>.
      </p>
      <p>
        Actual <code>member</code> value:
        <strong data-test="member-value">{{ member }}</strong>
      </p>
      <p
        data-test="result"
        :data-status="member === 5 ? 'pass' : 'fail'"
      >
        Result:
        <strong v-if="member === 5">PASS</strong>
        <strong v-else>FAIL (callback never ran)</strong>
      </p>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/vue';

export default defineComponent({
  name: 'RoutingGuards',
  components: {
    IonBackButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
  },
  data() {
    return { member: 0 };
  },
  beforeRouteEnter(_to, _from, next) {
    next((vm: any) => {
      vm.member = 5;
    });
  },
});
</script>
