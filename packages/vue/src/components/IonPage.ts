import { h, defineComponent } from 'vue';

export const IonPage = defineComponent({
  name: 'IonPage',
  setup(_, { attrs, slots }) {
    return () => {
      return h(
        'div',
        {
          ['class']: 'ion-page ion-page-invisible',
          ...attrs,
          ref: 'ionPage'
        },
        slots.default && slots.default()
      )
    }
  }
});
