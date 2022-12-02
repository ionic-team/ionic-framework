import { h, inject, defineComponent } from 'vue';
import { defineCustomElement } from '@ionic/core/components/ion-back-button.js';

export const IonBackButton = /*@__PURE__*/ defineComponent((_, { attrs, slots }) => {
  defineCustomElement();

  // TODO(FW-2969): type
  const ionRouter: any = inject('navManager');

  const onClick = () => {
    /**
     * When using ion-back-button outside of
     * a routing context, ionRouter is undefined.
     */
    if (ionRouter === undefined) { return; }

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
});
