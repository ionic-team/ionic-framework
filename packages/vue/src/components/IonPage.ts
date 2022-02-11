import { h, defineComponent } from 'vue';

export const IonPage = /*@__PURE__*/ defineComponent({
  name: 'IonPage',
  props: {
    isInOutlet: { type: Boolean, default: false },
    registerIonPage: { type: Function, default: () => {} }
  },
  mounted() {
    this.$props.registerIonPage(this.$refs.ionPage);
  },
  setup(props, { attrs, slots }) {
    const hidePageClass = (props.isInOutlet) ? 'ion-page-invisible' : '';
    const pageClass = attrs.class ? ` ${attrs.class}` : '';
    return () => {
      return h(
        'div',
        {
          ...attrs,
          ['class']: `ion-page ${hidePageClass}${pageClass}`,
          ref: 'ionPage'
        },
        slots.default && slots.default()
      )
    }
  }
});
