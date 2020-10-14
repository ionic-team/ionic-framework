import { h, defineComponent } from 'vue';

export const IonPage = defineComponent({
  name: 'IonPage',
  props: {
    isInOutlet: { type: Boolean, default: false }
  },
  setup(props, { attrs, slots }) {
    const hidePageClass = (props.isInOutlet) ? 'ion-page-invisible' : '';
    return () => {
      return h(
        'div',
        {
          ['class']: `ion-page ${hidePageClass}`,
          ...attrs,
          ref: 'ionPage'
        },
        slots.default && slots.default()
      )
    }
  }
});
