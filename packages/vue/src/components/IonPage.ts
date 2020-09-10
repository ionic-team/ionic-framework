import { h, defineComponent } from 'vue';

export const IonPage = defineComponent({
  name: 'IonPage',
  setup(_, { attrs, slots }) {
    return () => {
      return h(
        'div',
        {
          ['class']: 'ion-page',
          ...attrs,
          ref: 'ionPage'
        },
        slots.default && slots.default()
      )
    }
  }
});
