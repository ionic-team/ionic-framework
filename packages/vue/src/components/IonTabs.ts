import { defineCustomElement } from "@ionic/core/components/ion-tabs.js";
import type { VNode } from "vue";
import { h, defineComponent, Fragment, isVNode } from "vue";

import { IonTab } from "../proxies";

const WILL_CHANGE = "ionTabsWillChange";
const DID_CHANGE = "ionTabsDidChange";

// TODO(FW-2969): types

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

const isTabBar = (node: VNode) => {
  return (
    node.type &&
    ((node.type as any).name === "IonTabBar" || node.type === "ion-tab-bar")
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
  setup(props, { slots, emit }) {
    // Define the custom element
    defineCustomElement();

    return {
      props,
      slots,
      emit,
    };
  },
  render() {
    const { slots, emit, props } = this;
    const slottedContent = slots.default && slots.default();
    let routerOutlet;
    let hasTab = false;

    if (slottedContent && slottedContent.length > 0) {
      /**
       * Developers must pass an ion-router-outlet
       * inside of ion-tabs if they want to use
       * the history stack or URL updates associated
       * wit the router.
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

    if (slottedContent && slottedContent.length > 0) {
      const slottedTabBar = slottedContent.find((child: VNode) =>
        isTabBar(child)
      );

      if (slottedTabBar) {
        if (!slottedTabBar.props) {
          slottedTabBar.props = {};
        }
        /**
         * ionTabsWillChange and ionTabsDidChange are
         * fired from `ion-tabs`, so we need to pass these down
         * as props so they can fire when the active tab changes.
         * TODO: We may want to move logic from the tab bar into here
         * so we do not have code split across two components.
         */
        slottedTabBar.props._tabsWillChange = (tab: string) =>
          emit(WILL_CHANGE, { tab });
        slottedTabBar.props._tabsDidChange = (tab: string) =>
          emit(DID_CHANGE, { tab });
      }
    }

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
