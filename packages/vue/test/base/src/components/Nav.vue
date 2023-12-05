<template>
  <ion-nav :root="NavRoot" :root-params="rootParams"></ion-nav>
</template>

<script setup lang="ts">
import { IonNav } from "@ionic/vue";
import NavRoot from "@/components/NavRoot.vue";

const rootParams = {
  message: "Hello World!",
};
</script>
