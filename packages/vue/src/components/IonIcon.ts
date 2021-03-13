import { h, defineComponent } from 'vue';
import { isPlatform } from '@ionic/core';

export const IonIcon = defineComponent({
  name: 'IonIcon',
  props: {
    ariaLabel: String,
    color: String,
    flipRtl: Boolean,
    icon: String,
    ios: String,
    lazy: String,
    md: String,
    mode: String,
    name: String,
    size: String,
    src: String
  },
  setup(props, { slots }) {
    return () => {
      const { icon, ios, md } = props;

      let iconToUse: typeof icon;
      if (ios || md) {
        if (isPlatform('ios')) {
          iconToUse = ios ?? md ?? icon;
        } else {
          iconToUse = md ?? ios ?? icon;
        }
      } else {
        iconToUse = icon;
      }

      return h(
        'ion-icon',
        {
          ...props,
          icon: iconToUse
        },
        slots
      )
    }
  }
});
