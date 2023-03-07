import { defineCustomElement } from "ionicons/components/ion-icon.js";
import { h, defineComponent } from "vue";

import { getConfig } from "../utils";

export const IonIcon = /*@__PURE__*/ defineComponent({
  name: "IonIcon",
  props: {
    color: String,
    flipRtl: Boolean,
    icon: String,
    ios: String,
    lazy: String,
    md: String,
    mode: String,
    name: String,
    size: String,
    src: String,
  },
  setup(props, { slots }) {
    defineCustomElement();
    return () => {
      const { icon, ios, md, mode } = props;

      let iconToUse: typeof icon;

      const config = getConfig();
      const iconMode = mode || config.get("mode");

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
});
