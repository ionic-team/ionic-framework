import { defineComponent, h, ref, VNode, getCurrentInstance, ComponentInternalInstance } from 'vue';
import { needsKebabCase } from '../utils';

export interface OverlayProps {
  isOpen?: boolean;
}

/**
 * Make sure we only
 * warn user about each
 * event at most once.
 */
let willPresentWarn = false;
let didPresentWarn = false;
let willDismissWarn = false;
let didDismissWarn = false;

const checkForDeprecatedListeners = (instance: ComponentInternalInstance) => {
  const props = instance.vnode.props;
  if (!willPresentWarn && props.onOnWillPresent !== undefined) {
    console.warn('[@ionic/vue Deprecation]: @onWillPresent has been deprecated in favor of @willPresent and will be removed in Ionic Vue v6.0.');
    willPresentWarn = true;
  }

  if (!didPresentWarn && props.onOnDidPresent !== undefined) {
    console.warn('[@ionic/vue Deprecation]: @onDidPresent has been deprecated in favor of @didPresent and will be removed in Ionic Vue v6.0.');
    didPresentWarn = true;
  }

  if (!willDismissWarn && props.onOnWillDismiss !== undefined) {
    console.warn('[@ionic/vue Deprecation]: @onWillDismiss has been deprecated in favor of @willDismiss and will be removed in Ionic Vue v6.0.');
    willDismissWarn = true;
  }

  if (!didDismissWarn && props.onOnDidDismiss !== undefined) {
    console.warn('[@ionic/vue Deprecation]: @onDidDismiss has been deprecated in favor of @didDismiss and will be removed in Ionic Vue v6.0.');
    didDismissWarn = true;
  }
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
    { componentEv: `${eventPrefix}willpresent`, frameworkEv: 'willPresent', deprecatedEv: 'onWillPresent' },
    { componentEv: `${eventPrefix}didpresent`, frameworkEv: 'didPresent', deprecatedEv: 'onDidPresent' },
    { componentEv: `${eventPrefix}willdismiss`, frameworkEv: 'willDismiss', deprecatedEv: 'onWillDismiss' },
    { componentEv: `${eventPrefix}diddismiss`, frameworkEv: 'didDismiss', deprecatedEv: 'onDidDismiss' },
  ];
  const kebabCaseListeners = [
    { componentEv: `${name}-will-present`, frameworkEv: 'willPresent', deprecatedEv: 'onWillPresent' },
    { componentEv: `${name}-did-present`, frameworkEv: 'didPresent', deprecatedEv: 'onDidPresent' },
    { componentEv: `${name}-will-dismiss`, frameworkEv: 'willDismiss', deprecatedEv: 'onWillDismiss'  },
    { componentEv: `${name}-did-dismiss`, frameworkEv: 'didDismiss', deprecatedEv: 'onDidDismiss' },
  ];

  const Container = defineComponent<Props & OverlayProps>((props, { slots, emit }) => {
    const instance = getCurrentInstance();
    const adjustedEventListeners = needsKebabCase(instance.appContext.app.version) ? kebabCaseListeners : lowerCaseListeners;

    checkForDeprecatedListeners(instance);

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

      /**
       * When supporting both the "on" prefixed and non-"on" prefixed
       * events, there seems to be an issue where the handlers are
       * getting passed as props. This should be resolved when we drop
       * support for the "on" prefixed listeners.
       */
      const restOfProps = { ...(props as any) };
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

      adjustedEventListeners.forEach(eventListener => {
        overlay.value.addEventListener(eventListener.componentEv, () => {
          emit(eventListener.frameworkEv);
          emit(eventListener.deprecatedEv);
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
  Container.emits = [
    'willPresent', 'didPresent', 'willDismiss', 'didDismiss',
    'onWillPresent', 'onDidPresent', 'onWillDismiss', 'onDidDismiss'
  ];

  return Container;
}
