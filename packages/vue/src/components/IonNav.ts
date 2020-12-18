import { defineComponent, h } from 'vue';
import { VueDelegate } from '../framework-delegate';
import { defineCustomElement } from '../utils';
import { IonNav as IonNavCmp } from '@ionic/core/components/ion-nav.js';

export const IonNav = defineComponent({
  name: 'IonNav',
  setup(_, { slots }) {
    defineCustomElement('ion-nav', IonNavCmp);
    const delegate = VueDelegate();
    return () => {
      return h(
        'ion-nav',
        { delegate },
        slots
      )
    }
  }
});
