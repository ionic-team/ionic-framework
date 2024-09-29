import { defineCustomElement } from "@ionic/core/components/ion-tab-button.js";
import { h, defineComponent, inject } from "vue";

export const IonTabButton = /*@__PURE__*/ defineComponent({
  name: "IonTabButton",
  props: {
    _getTabState: {
      type: Function,
      default: () => {
        return {};
      },
    },
    disabled: Boolean,
    download: String,
    href: String,
    rel: String,
    layout: String,
    selected: Boolean,
    tab: String,
    target: String,
    _onClick: {
      type: Function,
      required: false,
    },
  },
  setup(props, { slots }) {
    defineCustomElement();

    // TODO(FW-2969): type
    const ionRouter: any = inject("navManager", null);
    const onClick = (ev: Event) => {
      if (ev.cancelable) {
        ev.preventDefault();
      }

      /**
       * Keeping track of the originalHref
       * (i.e. /tabs/tab1) lets us redirect
       * users back to a child page using currentHref
       * (i.e. /tabs/tab1/child).
       */
      const { tab, href, _getTabState } = props;
      const tabState = _getTabState();
      const hasRouterOutlet = tabState.hasRouterOutlet;
      const tappedTab = tabState.tabs[tab] || {};
      const originalHref = tappedTab.originalHref || href;
      /**
       * If the router outlet is not defined, then the tabs is being used
       * as a basic tab navigation without the router. In this case, we
       * don't want to update the href else the URL will change.
       */
      const currentHref = hasRouterOutlet ? tappedTab.currentHref || href : "";
      const prevActiveTab = tabState.activeTab;

      if (!hasRouterOutlet && props._onClick) {
        props._onClick(
          new CustomEvent("ionTabButtonClick", {
            detail: {
              href: currentHref,
              selected: tab === prevActiveTab,
              tab,
            },
          })
        );
      }

      /**
       * If we are still on the same
       * tab as before, but the base href
       * does not equal the current href,
       * then we must be on a child page and
       * should direct users back to the root
       * of the tab.
       */
      if (ionRouter !== null) {
        if (prevActiveTab === tab) {
          if (originalHref !== currentHref) {
            ionRouter.resetTab(tab);
          }
        } else {
          ionRouter.changeTab(tab, currentHref);
        }
      }
    };
    return () => {
      return h(
        "ion-tab-button",
        {
          onClick,
          ...props,
        },
        slots.default && slots.default()
      );
    };
  },
});
