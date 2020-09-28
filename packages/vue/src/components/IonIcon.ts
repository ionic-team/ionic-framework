import { h, defineComponent } from 'vue';
import { isPlatform } from '@ionic/core';

export const IonIcon = defineComponent({
  name: 'IonIcon',
  setup(_, { attrs, slots }) {
    return () => {
      const { icon, ios, md, ...restOfAttrs } = attrs;

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
          ...restOfAttrs,
          icon: iconToUse
        },
        slots
      )
    }
  }
});
