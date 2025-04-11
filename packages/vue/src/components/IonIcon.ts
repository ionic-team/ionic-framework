import type { JSX } from "@ionic/core/components";
import { defineCustomElement } from "ionicons/components/ion-icon.js";
import type { PropType } from "vue";
import { h, defineComponent } from "vue";

import { getConfig } from "../utils";

export const IonIcon = /*@__PURE__*/ defineComponent<JSX.IonIcon>(
  (props, { slots }) => {
    defineCustomElement();
    return () => {
      const { icon, ios, md, mode } = props;

      let iconToUse: typeof icon;

      const config = getConfig();
      const iconMode = mode || config?.get("mode");

      if (ios || md) {
        if (iconMode === "ios") {
          iconToUse = ios ?? md ?? icon;
        } else {
          iconToUse = md ?? ios ?? icon;
        }
      } else {
        iconToUse = icon;
      }

      return h(
        "ion-icon",
        {
          ...props,
          icon: iconToUse,
        },
        slots
      );
    };
  },
  {
    name: "IonIcon",
    props: {
      color: { type: String as PropType<string> },
      flipRtl: { type: Boolean as PropType<boolean> },
      icon: { type: String as PropType<string> },
      ios: { type: String as PropType<string> },
      lazy: { type: Boolean as PropType<boolean> },
      md: { type: String as PropType<string> },
      mode: { type: String as PropType<string> },
      name: { type: String as PropType<string> },
      size: { type: String as PropType<string> },
      src: { type: String as PropType<string> },
    },
  }
);
