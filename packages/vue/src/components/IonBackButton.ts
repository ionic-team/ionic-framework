import { h, inject, defineComponent } from 'vue';

export const IonBackButton = defineComponent({
  name: 'IonBackButton',
  setup(_, { attrs, slots }) {
    const ionRouter: any = inject('navManager');

    const onClick = () => {
      const defaultHref = attrs['default-href'] || attrs['defaultHref'];
      const routerAnimation = attrs['router-animation'] || attrs['routerAnimation'];

      ionRouter.handleNavigateBack(defaultHref, routerAnimation);
    }

    return () => {
      return h(
        'ion-back-button',
        {
          onClick,
          ...attrs
        },
        slots.default && slots.default()
      )
    }
  }
});
