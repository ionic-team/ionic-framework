import { defineCustomElement } from "@ionic/core/components/ion-nav.js";
import type { VNode } from "vue";
import { defineComponent, h, shallowRef } from "vue";

import { VueDelegate } from "../framework-delegate";

export const IonNav = /*@__PURE__*/ defineComponent(() => {
  defineCustomElement();
  const views = shallowRef([]);

  /**
   * Allows us to create the component
   * within the Vue application context.
   */
  const addView = (component: VNode) =>
    (views.value = [...views.value, component]);
  const removeView = (component: VNode) =>
    (views.value = views.value.filter((cmp) => cmp !== component));

  const delegate = VueDelegate(addView, removeView);
  return () => {
    return h("ion-nav", { delegate }, views.value);
  };
});

IonNav.displayName = "IonNav";
