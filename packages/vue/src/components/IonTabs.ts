import type { VNode } from "vue";
import { h, defineComponent } from "vue";

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

export const IonTabs = /*@__PURE__*/ defineComponent({
  name: "IonTabs",
  emits: [WILL_CHANGE, DID_CHANGE],
  render() {
    const { $slots: slots, $emit } = this;
    const slottedContent = slots.default && slots.default();
    let routerOutlet;

    /**
     * Developers must pass an ion-router-outlet
     * inside of ion-tabs.
     */
    if (slottedContent && slottedContent.length > 0) {
      routerOutlet = slottedContent.find((child: VNode) =>
        isRouterOutlet(child)
      );
    }

    if (!routerOutlet) {
      throw new Error(
        "IonTabs must contain an IonRouterOutlet. See https://ionicframework.com/docs/vue/navigation#working-with-tabs for more information."
      );
    }

    let childrenToRender = [
      h(
        "div",
        {
          class: "tabs-inner",
          style: {
            position: "relative",
            flex: "1",
            contain: "layout size style",
          },
        },
        routerOutlet
      ),
    ];

    /**
     * If ion-tab-bar has slot="top" it needs to be
     * rendered before `.tabs-inner` otherwise it will
     * not show above the tab content.
     */
    if (slottedContent && slottedContent.length > 0) {
      /**
       * Render all content except for router outlet
       * since that needs to be inside of `.tabs-inner`.
       */
      const filteredContent = slottedContent.filter(
        (child: VNode) => !child.type || !isRouterOutlet(child)
      );

      const slottedTabBar = filteredContent.find((child: VNode) =>
        isTabBar(child)
      );
      const hasTopSlotTabBar =
        slottedTabBar && slottedTabBar.props?.slot === "top";

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
          $emit(WILL_CHANGE, { tab });
        slottedTabBar.props._tabsDidChange = (tab: string) =>
          $emit(DID_CHANGE, { tab });
      }

      if (hasTopSlotTabBar) {
        childrenToRender = [...filteredContent, ...childrenToRender];
      } else {
        childrenToRender = [...childrenToRender, ...filteredContent];
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
      childrenToRender
    );
  },
});
