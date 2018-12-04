<template>
  <div @click="catchIonicGoBack">
    <router-view :name="name"/>
  </div>
</template>

<script lang="ts">
import { Prop } from 'vue-property-decorator';
import Component, { mixins } from 'vue-class-component';
import CatchIonicGoBack from '../mixins/catch-ionic-go-back';

@Component
export default class IonVueRouter extends mixins(CatchIonicGoBack) {
  @Prop({ default: 'default'}) name!: string;
}
</script>
