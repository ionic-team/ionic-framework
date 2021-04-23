import { defineComponent, h, ref, VNode, getCurrentInstance } from 'vue';
import { needsKebabCase } from '../utils';

export interface OverlayProps {
  isOpen?: boolean;
}

export const defineOverlayContainer = <Props extends object>(name: string, componentProps: string[] = [], controller: any) => {
  /**
   * Vue 3.0.6 fixed a bug where events on custom elements
   * were always converted to lower case, so "ionRefresh"
   * became "ionrefresh". We need to account for the old
   * issue as well as the new behavior where "ionRefresh"
   * is converted to "ion-refresh".
   * See https://github.com/vuejs/vue-next/pull/2847
   */
  const eventPrefix = name.toLowerCase().split('-').join('');
  const lowerCaseListeners = [
    { componentEv: `${eventPrefix}willpresent`, frameworkEv: 'willPresent' },
    { componentEv: `${eventPrefix}didpresent`, frameworkEv: 'didPresent' },
    { componentEv: `${eventPrefix}willdismiss`, frameworkEv: 'willDismiss' },
    { componentEv: `${eventPrefix}diddismiss`, frameworkEv: 'didDismiss' },
  ];
  const kebabCaseListeners = [
    { componentEv: `${name}-will-present`, frameworkEv: 'willPresent' },
    { componentEv: `${name}-did-present`, frameworkEv: 'didPresent' },
    { componentEv: `${name}-will-dismiss`, frameworkEv: 'willDismiss' },
    { componentEv: `${name}-did-dismiss`, frameworkEv: 'didDismiss' },
  ];

  const Container = defineComponent<Props & OverlayProps>((props, { slots, emit }) => {
    const instance = getCurrentInstance();
    const adjustedEventListeners = needsKebabCase(instance.appContext.app.version) ? kebabCaseListeners : lowerCaseListeners;

    const overlay = ref();
    const onVnodeMounted = async () => {
      const isOpen = props.isOpen;
      isOpen && (await present(props))
    }

    const onVnodeUpdated = async (node: VNode, prevNode: VNode) => {
      const isOpen = node.props!.isOpen;
      const prevIsOpen = prevNode.props!.isOpen;

      /**
       * Do not do anything if this prop
       * did not change.
       */
      if (isOpen === prevIsOpen) return;

      if (isOpen) {
        await present(props);
      } else {
        await dismiss();
      }
    }

    const onVnodeBeforeUnmount = async () => {
      await dismiss();
    }

    const dismiss = async () => {
      if (!overlay.value) return;

      await overlay.value;

      overlay.value = overlay.value.dismiss();

      await overlay.value;

      overlay.value = undefined;
    }

    const present = async (props: Readonly<Props>) => {
      /**
       * Do not open another instance
       * if one is already opened.
       */
      if (overlay.value) {
        await overlay.value;
      }

      if (overlay.value?.present) {
        await overlay.value.present();
        return;
      }

      const component = slots.default && slots.default()[0];
      overlay.value = controller.create({
        ...props,
        component
      });

      overlay.value = await overlay.value;

      adjustedEventListeners.forEach(eventListener => {
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
          onVnodeBeforeUnmount,
          isOpen: props.isOpen
        }
      );
    }
  });

  Container.displayName = name;
  Container.props = [...componentProps, 'isOpen'];
  Container.emits = ['willPresent', 'didPresent', 'willDismiss', 'didDismiss'];

  return Container;
}
