import { defineComponent, h, ref, VNode, onMounted } from 'vue';

// TODO(FW-2969): types

export interface OverlayProps {
  isOpen?: boolean;
}

const EMPTY_PROP = Symbol();
const DEFAULT_EMPTY_PROP = { default: EMPTY_PROP };

export const defineOverlayContainer = <Props extends object>(name: string, defineCustomElement: () => void, componentProps: string[] = [], hasDelegateHost?: boolean, controller?: any) => {

  const createControllerComponent = () => {
    return defineComponent<Props & OverlayProps>((props, { slots, emit }) => {
      const eventListeners = [
        { componentEv: `${name}-will-present`, frameworkEv: 'willPresent' },
        { componentEv: `${name}-did-present`, frameworkEv: 'didPresent' },
        { componentEv: `${name}-will-dismiss`, frameworkEv: 'willDismiss' },
        { componentEv: `${name}-did-dismiss`, frameworkEv: 'didDismiss' },
      ];

      if (defineCustomElement !== undefined) {
        defineCustomElement();
      }

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

        let restOfProps: any = {};

        /**
         * We can use Object.entries here
         * to avoid the hasOwnProperty check,
         * but that would require 2 iterations
         * where as this only requires 1.
         */
        for (const key in props) {
          const value = props[key] as any;
          if (props.hasOwnProperty(key) && value !== EMPTY_PROP) {
            restOfProps[key] = value;
          }
        }

        /**
         * These are getting passed as props.
         * Potentially a Vue bug with Web Components?
         */
        delete restOfProps.onWillPresent;
        delete restOfProps.onDidPresent;
        delete restOfProps.onWillDismiss;
        delete restOfProps.onDidDismiss;

        const component = slots.default && slots.default()[0];
        overlay.value = controller.create({
          ...restOfProps,
          component
        });

        overlay.value = await overlay.value;

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
            onVnodeBeforeUnmount,
            isOpen: props.isOpen === true
          }
        );
      }
    });
  };
  const createInlineComponent = () => {
    return defineComponent((props, { slots }) => {
      if (defineCustomElement !== undefined) {
        defineCustomElement();
      }
      const isOpen = ref(false);
      const elementRef = ref();

      onMounted(() => {
        elementRef.value.addEventListener('ion-mount', () => isOpen.value = true);
        elementRef.value.addEventListener('will-present', () => isOpen.value = true);
        elementRef.value.addEventListener('did-dismiss', () => isOpen.value = false);
      });

      return () => {
        let restOfProps: any = {};

        /**
         * We can use Object.entries here
         * to avoid the hasOwnProperty check,
         * but that would require 2 iterations
         * where as this only requires 1.
         */
        for (const key in props) {
          const value = (props as any)[key];
          if (props.hasOwnProperty(key) && value !== EMPTY_PROP) {
            restOfProps[key] = value;
          }
        }

        /**
         * Some overlays need a wrapper element so content
         * takes up the full size of the parent overlay.
         */
        const renderChildren = () => {
          if (hasDelegateHost) {
            return h('div', { className: 'ion-delegate-host ion-page' }, slots);
          }

          return slots;
        }

        return h(
          name,
          { ...restOfProps, ref: elementRef },

          /**
           * When binding keepContentsMounted as an attribute
           * i.e. <ion-modal keep-contents-mounted></ion-modal>
           * the value of the prop will be the empty string which is
           * why we still call renderChildren() in that case.
           */
          (isOpen.value || restOfProps.keepContentsMounted || restOfProps.keepContentsMounted === '') ? renderChildren() : undefined
        )
      }
    });
  }

  const Container = (controller !== undefined) ? createControllerComponent() : createInlineComponent();

  Container.name = name;

  Container.props = {
    'isOpen': DEFAULT_EMPTY_PROP
  };

  componentProps.forEach(componentProp => {
    Container.props[componentProp] = DEFAULT_EMPTY_PROP;
  });

  if (controller !== undefined) {
    Container.emits = ['willPresent', 'didPresent', 'willDismiss', 'didDismiss'];
  }

  return Container;
}
