import { defineComponent, h } from 'vue';
import { VueDelegate } from '../framework-delegate';

export const IonNav = defineComponent({
  name: 'IonNav',
  setup(_, { slots }) {
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
