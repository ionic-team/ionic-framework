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
    return () => {
      const existingClasses = attrs.class ?? '';
      return h(
        'div',
        {
          ...attrs,
          ['class']: `ion-page ${hidePageClass} ${existingClasses}`,
          ref: 'ionPage'
        },
        slots.default && slots.default()
      )
    }
  }
});
