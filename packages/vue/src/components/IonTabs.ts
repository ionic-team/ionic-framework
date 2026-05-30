import { defineCustomElement } from "@ionic/core/components/ion-tabs.js";
import type { VNode } from "vue";
import {
  h,
  defineComponent,
  Fragment,
  isVNode,
  provide,
  shallowRef,
} from "vue";

import { IonTab } from "../proxies";

const WILL_CHANGE = "ionTabsWillChange";
const DID_CHANGE = "ionTabsDidChange";

// TODO(FW-2969): types

interface TabBarData {
  hasRouterOutlet: boolean;
  _tabsWillChange: Function;
  _tabsDidChange: Function;
}

/**
 * Vue 3.2.38 fixed an issue where Web Component
 * names are respected using kebab case instead of pascal case.
 * As a result, we need to account for both here since we support
 * versions of Vue < 3.2.38.
 */
// TODO FW-5904
const isRouterOutlet = (node: VNode) => {
  return (
    node.type &&
    ((node.type as any).name === "IonRouterOutlet" ||
      node.type === "ion-router-outlet")
  );
};

const isTab = (node: VNode): boolean => {
  // The `ion-tab` component was created with the `v-for` directive.
  if (node.type === Fragment) {
    if (Array.isArray(node.children)) {
      return node.children.some((child) => isVNode(child) && isTab(child));
    }

    return false; // In case the fragment has no children.
  }

  return (
    node.type && ((node.type as any).name === "ion-tab" || node.type === IonTab)
  );
};

export const IonTabs = /*@__PURE__*/ defineComponent({
  name: "IonTabs",
  emits: [WILL_CHANGE, DID_CHANGE],
  data() {
    return {
      hasRouterOutlet: false,
    };
  },
  setup(props, { slots, emit }) {
    const slottedContent: VNode[] | undefined =
      slots.default && slots.default();
    let routerOutlet: VNode | undefined = undefined;

    if (slottedContent && slottedContent.length > 0) {
      /**
       * Developers must pass an ion-router-outlet
       * inside of ion-tabs if they want to use
       * the history stack or URL updates associated
       * with the router.
       */
      routerOutlet = slottedContent.find((child: VNode) =>
        isRouterOutlet(child)
      );
    }

    /**
     * Tab bar can be used as a standalone component,
     * so it cannot be modified directly through
     * IonTabs. Instead, data will be passed through
     * the provide/inject.
     */
    provide(
      "tabBarData",
      shallowRef<TabBarData>({
        hasRouterOutlet: !!routerOutlet,
        _tabsWillChange: (tab: string) => emit(WILL_CHANGE, { tab }),
        _tabsDidChange: (tab: string) => emit(DID_CHANGE, { tab }),
      })
    );

    return {
      props,
      slots,
      emit,
    };
  },
  mounted() {
    /**
     * `defineCustomElement` must be called in the `mounted` hook
     * to ensure that the custom element is defined after the
     * component has been fully rendered and initialized.
     * This prevents issues with undefined properties, like
     * `selectedTab` from core, which may occur if the custom
     * element is defined too early in the component's lifecycle.
     */
    defineCustomElement();
  },
  render() {
    const { slots, props } = this;
    const slottedContent: VNode[] | undefined =
      slots.default && slots.default();
    let routerOutlet: VNode | undefined = undefined;
    let hasTab = false;

    if (slottedContent && slottedContent.length > 0) {
      /**
       * Developers must pass an ion-router-outlet
       * inside of ion-tabs if they want to use
       * the history stack or URL updates associated
       * with the router.
       */
      routerOutlet = slottedContent.find((child: VNode) =>
        isRouterOutlet(child)
      );

      /**
       * Developers must pass at least one ion-tab
       * inside of ion-tabs if they want to use a
       * basic tab-based navigation without the
       * history stack or URL updates associated
       * with the router.
       */
      hasTab = slottedContent.some((child: VNode) => isTab(child));
    }

    if (!routerOutlet && !hasTab) {
      throw new Error("IonTabs must contain an IonRouterOutlet or an IonTab.");
    }
    if (routerOutlet && hasTab) {
      throw new Error(
        "IonTabs cannot contain an IonRouterOutlet and IonTab at the same time."
      );
    }

    if (hasTab) {
      return h(
        "ion-tabs",
        {
          ...props,
        },
        slottedContent
      );
    }

    /**
     * TODO(ROU-11056)
     *
     * Vue handles the error case for when there is no
     * associated page matching the tab `href`.
     *
     * More investigation is needed to determine if we
     * override the error handling and provide our own
     * error message.
     */

    return h(
      "ion-tabs",
      {
        style: {
          display: "flex",
          position: "absolute",
          top: "0",
          left: "0",
          right: "0",
          bottom: "0",
          "flex-direction": "column",
          width: "100%",
          height: "100%",
          contain: "layout size style",
          "z-index": "0",
        },
      },
      slottedContent
    );
  },
});
