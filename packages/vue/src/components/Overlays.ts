import {
  JSX,
  actionSheetController
} from '@ionic/core';
import { FunctionalComponent, defineComponent, h, ref } from 'vue';

interface OverlayProps {
  isOpen?: boolean;
}

const defineOverlayContainer = <Props extends object>(name: string, componentProps: string[] = [], controller: any) => {
  // TODO
  const eventPrefix = name.toLowerCase().split('-').join('');
  const eventListeners = [
    { componentEv: `${eventPrefix}willpresent`, frameworkEv: 'onWillPresent' },
    { componentEv: `${eventPrefix}didpresent`, frameworkEv: 'onDidPresent' },
    { componentEv: `${eventPrefix}willdismiss`, frameworkEv: 'onWillDismiss' },
    { componentEv: `${eventPrefix}diddismiss`, frameworkEv: 'onDidDismiss' },
  ];

  const Container: FunctionalComponent<Props & OverlayProps> = defineComponent((props, { slots }) => {
    const overlay = ref();
    const content = ref();

    const onVnodeMounted = async () => {
      const isOpen = props.isOpen;
      isOpen && (await present(props))
    }

    const onVnodeUpdated = async () => {
      const isOpen = props.isOpen;
      if (isOpen) {
        await overlay.value?.present() || present(props);
      } else {
        await overlay.value?.dismiss();
        overlay.value = undefined;
      }
    }

    const onVnodeBeforeUnmount = async () => {
      await overlay.value?.dismiss();
      overlay.value = undefined;
    }

    const present = async (props: Readonly<Props>) => {
      overlay.value = await controller.create({
        ...props,
        component: content.value
      });

      await overlay.value.present();
    }

    return () => {
      return h(
        'div',
        {
          style: { display: 'none' },
          onVnodeMounted,
          onVnodeUpdated,
          onVnodeBeforeUnmount
        },
        [h('div', { ref: content }, slots.default && slots.default())]
      );
    }
  });

  Container.displayName = name;
  Container.props = [...componentProps, 'isOpen'];
  Container.emits = eventListeners.map(ev => ev.componentEv);

  return Container;
}


export const IonActionSheet = /*@__PURE__*/defineOverlayContainer<JSX.IonActionSheet>('ion-action-sheet', [
  'keyboardClose',
  'enterAnimation',
  'leaveAnimation',
  'buttons',
  'cssClass',
  'backdropDismiss',
  'header',
  'subHeader',
  'translucent',
  'animated'
], actionSheetController);
