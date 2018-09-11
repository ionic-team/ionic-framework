<template>
  <div @click="catchIonicGoBack">
    <router-view :name="name"/>
  </div>
</template>

<script>
import catchIonicGoBack from '../mixins/catch-ionic-go-back.js'

export default {
  name: 'IonVueRouter',
  mixins: [catchIonicGoBack],
  props: {
    // A name to call "named views" by
    name: {
      type: String,
      default: 'default',
    },
  },
}
</script>
