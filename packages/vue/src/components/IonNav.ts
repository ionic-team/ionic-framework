import { defineCustomElement } from "@ionic/core/components/ion-nav.js";
import type { VNode } from "vue";
import { defineComponent, h, shallowRef } from "vue";

import { VueDelegate } from "../framework-delegate";

export const IonNav = /*@__PURE__*/ defineComponent((props) => {
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
    return h("ion-nav", { ...props, delegate }, views.value);
  };
});

IonNav.name = "IonNav";

/**
 * The default values follow what is defined at
 * https://ionicframework.com/docs/api/nav#properties
 * otherwise the default values on the Web Component
 * may be overridden. For example, if the default animated value
 * is not `true` below, then Vue would default the prop to `false`
 * which would override the Web Component default of `true`.
 */
IonNav.props = {
  animated: {
    type: Boolean,
    default: true
  },
  animation: {
    type: Function,
    default: undefined
  },
  root: {
    type: [Function, Object, String],
    default: undefined
  },
  rootParams: {
    type: Object,
    default: undefined
  },
  swipeGesture: {
    type: Boolean,
    default: undefined
  }
}
