import Vue, { ComponentOptions } from "vue";
import { Controllers } from "./ionic";

declare module "vue/types/vue" {
  interface Vue {
    $ionic: Controllers;
  }
}
