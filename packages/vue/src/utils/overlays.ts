import type { VNode, ComponentOptions } from "vue";
import { defineComponent, h, ref, onMounted } from "vue";

// TODO(FW-2969): types

export interface OverlayProps {
  isOpen?: boolean;
}

const EMPTY_PROP = Symbol();
const DEFAULT_EMPTY_PROP = { default: EMPTY_PROP };

export const defineOverlayContainer = <Props extends object>(
  name: string,
  defineCustomElement: () => void,
  componentProps: string[] = [],
  hasDelegateHost?: boolean,
  controller?: any
) => {
  const createControllerComponent = (options: ComponentOptions) => {
    return defineComponent<Props & OverlayProps>((props, { slots, emit }) => {
      const eventListeners = [
        { componentEv: `${name}WillPresent`, frameworkEv: "willPresent" },
        { componentEv: `${name}DidPresent`, frameworkEv: "didPresent" },
        { componentEv: `${name}WillDismiss`, frameworkEv: "willDismiss" },
        { componentEv: `${name}DidDismiss`, frameworkEv: "didDismiss" },
      ];

      if (defineCustomElement !== undefined) {
        defineCustomElement();
      }

      const overlay = ref();
      const onVnodeMounted = async () => {
        const isOpen = props.isOpen;
        isOpen && (await present(props));
      };

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
      };

      const onVnodeBeforeUnmount = async () => {
        await dismiss();
      };

      const dismiss = async () => {
        if (!overlay.value) return;

        await overlay.value;

        overlay.value = overlay.value.dismiss();

        await overlay.value;

        overlay.value = undefined;
      };

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

        const restOfProps: Record<string, unknown> = {};

        /**
         * We can use Object.entries here
         * to avoid the hasOwnProperty check,
         * but that would require 2 iterations
         * where as this only requires 1.
         */
        for (const key in props) {
          const value = props[key] as any;
          if (
            Object.prototype.hasOwnProperty.call(props, key) &&
            value !== EMPTY_PROP
          ) {
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
          component,
        });

        overlay.value = await overlay.value;

        eventListeners.forEach((eventListener) => {
          overlay.value.addEventListener(eventListener.componentEv, () => {
            emit(eventListener.frameworkEv);
          });
        });

        await overlay.value.present();
      };

      return () => {
        return h("div", {
          style: { display: "none" },
          onVnodeMounted,
          onVnodeUpdated,
          onVnodeBeforeUnmount,
          isOpen: props.isOpen === true,
        });
      };
    }, options);
  };
  const createInlineComponent = (options: any) => {
    return defineComponent((props, { slots, emit }) => {
      if (defineCustomElement !== undefined) {
        defineCustomElement();
      }
      const isOpen = ref(false);
      const elementRef = ref();

      onMounted(() => {
        elementRef.value.addEventListener("ionMount", (ev: Event) => {
          emit("ionMount", ev);
          isOpen.value = true;
        });
        elementRef.value.addEventListener("willPresent", (ev: Event) => {
          emit("willPresent", ev);
          isOpen.value = true;
        });
        elementRef.value.addEventListener("didDismiss", (ev: Event) => {
          emit("didDismiss", ev);
          isOpen.value = false;
        });
        elementRef.value.addEventListener("willDismiss", (ev: Event) => {
          emit("willDismiss", ev);
        });
        elementRef.value.addEventListener("didPresent", (ev: Event) => {
          emit("didPresent", ev);
        });
      });

      return () => {
        const restOfProps: Record<string, unknown> = {};

        /**
         * We can use Object.entries here
         * to avoid the hasOwnProperty check,
         * but that would require 2 iterations
         * where as this only requires 1.
         */
        for (const key in props) {
          const value = (props as any)[key];
          if (
            Object.prototype.hasOwnProperty.call(props, key) &&
            value !== EMPTY_PROP
          ) {
            restOfProps[key] = value;
          }
        }

        /**
         * Some overlays need a wrapper element so content
         * takes up the full size of the parent overlay.
         */
        const renderChildren = () => {
          if (hasDelegateHost) {
            return h("div", { className: "ion-delegate-host ion-page" }, slots);
          }

          return slots;
        };

        return h(
          name,
          { ...restOfProps, ref: elementRef },

          /**
           * When binding keepContentsMounted as an attribute
           * i.e. <ion-modal keep-contents-mounted></ion-modal>
           * the value of the prop will be the empty string which is
           * why we still call renderChildren() in that case.
           */
          isOpen.value ||
            restOfProps.keepContentsMounted ||
            restOfProps.keepContentsMounted === ""
            ? renderChildren()
            : undefined
        );
      };
    }, options);
  };

  const options: ComponentOptions = {
    name,
    props: {
      isOpen: DEFAULT_EMPTY_PROP,
      ...componentProps.reduce((acc, prop) => {
        acc[prop] = DEFAULT_EMPTY_PROP;
        return acc;
      }, {} as Record<string, unknown>),
    },
    emits:
      typeof controller !== "undefined"
        ? ["willPresent", "didPresent", "willDismiss", "didDismiss"]
        : undefined,
  };

  return controller !== undefined
    ? createControllerComponent(options)
    : createInlineComponent(options);
};
