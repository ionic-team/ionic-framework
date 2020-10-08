import { defineComponent, h, ref } from 'vue';

export interface OverlayProps {
  isOpen?: boolean;
}

export const defineOverlayContainer = <Props extends object>(name: string, componentProps: string[] = [], controller: any) => {
  // TODO
  const eventPrefix = name.toLowerCase().split('-').join('');
  const eventListeners = [
    { componentEv: `${eventPrefix}willpresent`, frameworkEv: 'onWillPresent' },
    { componentEv: `${eventPrefix}didpresent`, frameworkEv: 'onDidPresent' },
    { componentEv: `${eventPrefix}willdismiss`, frameworkEv: 'onWillDismiss' },
    { componentEv: `${eventPrefix}diddismiss`, frameworkEv: 'onDidDismiss' },
  ];

  const Container = defineComponent<Props & OverlayProps>((props, { slots, emit }) => {
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
      const component = (slots) ? h('div', { ref: content }, slots) : undefined;
      overlay.value = await controller.create({
        ...props,
        component
      });

      eventListeners.forEach(eventListener => {
        overlay.value.addEventListener(eventListener.componentEv, () => {
          emit(eventListener.frameworkEv);
        });
      })

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
        }
      );
    }
  });

  Container.displayName = name;
  Container.props = [...componentProps, 'isOpen'];
  Container.emits = eventListeners.map(ev => ev.frameworkEv);

  return Container;
}
