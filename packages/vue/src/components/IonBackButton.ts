import { defineCustomElement } from "@ionic/core/components/ion-back-button.js";
import { h, inject, defineComponent } from "vue";

import { getConfig } from "../utils";

export const IonBackButton = /*@__PURE__*/ defineComponent(
  (_, { attrs, slots }) => {
    defineCustomElement();

    // TODO(FW-2969): type
    const ionRouter: any = inject("navManager");

    const onClick = (ev: Event) => {
      /**
       * When using ion-back-button outside of
       * a routing context, ionRouter is undefined.
       */
      if (ionRouter === undefined) {
        return;
      }

      /**
       * If ion-back-button is being used inside
       * of ion-nav (e.g. in a modal) then we should
       * not interact with the router. The core
       * ion-back-button component will handle the
       * nav.pop() in that case.
       */
      const target = ev.target as HTMLElement | null;
      if (target && target.closest("ion-nav") !== null) {
        return;
      }

      /**
       * Core resolves `backButtonDefaultHref` itself and only renders the
       * button once it has a href, so read the config here too or a
       * config-only back button would be visible but do nothing.
       */
      const defaultHref =
        attrs["default-href"] ||
        attrs["defaultHref"] ||
        getConfig()?.get("backButtonDefaultHref");
      const routerAnimation =
        attrs["router-animation"] || attrs["routerAnimation"];

      ionRouter.handleNavigateBack(defaultHref, routerAnimation);
    };

    return () => {
      return h(
        "ion-back-button",
        {
          onClick,
          ...attrs,
        },
        slots.default && slots.default()
      );
    };
  },
  {
    name: "IonBackButton",
  }
);
