import { defineCustomElement } from "@ionic/core/components/ion-app.js";
import type { VNode } from "vue";
import { h, defineComponent, shallowRef } from "vue";

const userComponents = shallowRef([]);
export const IonApp = /*@__PURE__*/ defineComponent((_, { attrs, slots }) => {
  defineCustomElement();
  return () => {
    return h(
      "ion-app",
      {
        ...attrs,
      },
      [slots.default && slots.default(), ...userComponents.value]
    );
  };
});

/**
 * When rendering user components inside of
 * ion-modal, or ion-popover the component
 * needs to be created inside of the current application
 * context otherwise libraries such as vue-i18n or vuex
 * will not work properly.
 *
 * `userComponents` renders teleported components as children
 * of `ion-app` within the current application context.
 */
export const addTeleportedUserComponent = (component: VNode) => {
  userComponents.value = [...userComponents.value, component];
};

export const removeTeleportedUserComponent = (component: VNode) => {
  /**
   * Finds the index of the component in the array and removes it.
   * Previously we were using a filter to remove the component from the array,
   * but this was causing a bug where dismissing an overlay and then presenting
   * a new overlay, would cause the new overlay to be removed.
   */
  const index = userComponents.value.findIndex((cmp) => cmp === component);
  if (index !== -1) {
    userComponents.value.splice(index, 1);
  }
};
