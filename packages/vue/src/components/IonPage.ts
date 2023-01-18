import { h, defineComponent } from 'vue';

export const IonPage = /*@__PURE__*/ defineComponent({
  name: 'IonPage',
  props: {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    registerIonPage: { type: Function, default: () => {} }
  },
  mounted() {
    this.$props.registerIonPage(this.$refs.ionPage);
  },
  setup(_, { attrs, slots }) {
    return () => {
      return h(
        'div',
        {
          ...attrs,
          ['class']: 'ion-page',
          ref: 'ionPage'
        },
        slots.default && slots.default()
      )
    }
  }
});
