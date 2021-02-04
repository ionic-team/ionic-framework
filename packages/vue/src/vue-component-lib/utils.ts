import { VNode, defineComponent, getCurrentInstance, h, inject, ref, Ref } from 'vue';

export interface InputProps extends Object {
  modelValue: string | boolean;
}

const UPDATE_VALUE_EVENT = 'update:modelValue';
const MODEL_VALUE = 'modelValue';
const ROUTER_LINK_VALUE = 'routerLink';
const NAV_MANAGER = 'navManager';
const ROUTER_PROP_REFIX = 'router';

interface NavManager<T = any> {
  navigate: (options: T) => void;
}

interface ComponentOptions {
  modelProp?: string;
  modelUpdateEvent?: string;
  routerLinkComponent?: boolean;
}

const getComponentClasses = (classes: unknown) => {
  return (classes as string)?.split(' ') || [];
};

const getElementClasses = (ref: Ref<HTMLElement | undefined>, componentClasses: Set<string>, defaultClasses: string[] = []) => {
  return [ ...Array.from(ref.value?.classList || []), ...defaultClasses ]
    .filter((c: string, i, self) => !componentClasses.has(c) && self.indexOf(c) === i);
};

/**
* Create a callback to define a Vue component wrapper around a Web Component.
*
* @prop name - The component tag name (i.e. `ion-button`)
* @prop componentProps - An array of properties on the
* component. These usually match up with the @Prop definitions
* in each component's TSX file.
* @prop componentOptions - An object that defines additional
* options for the component such as router or v-model
* integrations.
*/
export const defineContainer = <Props>(name: string, componentProps: string[] = [], componentOptions: ComponentOptions = {}) => {
  const { modelProp, modelUpdateEvent, routerLinkComponent } = componentOptions;

  /**
  * Create a Vue component wrapper around a Web Component.
  * Note: The `props` here are not all properties on a component.
  * They refer to whatever properties are set on an instance of a component.
  */
  const Container = defineComponent<Props & InputProps>((props, { attrs, slots, emit }) => {
    const containerRef = ref<HTMLElement>();
    const classes = new Set(getComponentClasses(attrs.class));
    const onVnodeBeforeMount = (vnode: VNode) => {
      // Add a listener to tell Vue to update the v-model
      if (vnode.el) {
        vnode.el.addEventListener(modelUpdateEvent.toLowerCase(), (e: Event) => {
          emit(UPDATE_VALUE_EVENT, (e?.target as any)[modelProp]);
        });
      }
    };

    let handleClick: (ev: Event) => void;
    if (routerLinkComponent) {
      const currentInstance = getCurrentInstance();
      const hasRouter = currentInstance?.appContext?.provides[NAV_MANAGER];
      const navManager: NavManager | undefined = hasRouter ? inject(NAV_MANAGER) : undefined;
      handleClick = (ev: Event) => {
        const routerProps = Object.keys(props).filter(p => p.startsWith(ROUTER_PROP_REFIX));
        if (routerProps.length === 0) return;

        if (navManager !== undefined) {
          let navigationPayload: any = { event: ev };
          routerProps.forEach(prop => {
            navigationPayload[prop] = (props as any)[prop];
          });
          navManager.navigate(navigationPayload);
        } else {
          console.warn('Tried to navigate, but no router was found. Make sure you have mounted Vue Router.');
        }
      }
    }

    return () => {
      getComponentClasses(attrs.class).forEach(value => {
        classes.add(value);
      });

      let propsToAdd = {
        ...props,
        ref: containerRef,
        class: getElementClasses(containerRef, classes),
        onClick: (routerLinkComponent) ? handleClick : (props as any).onClick,
        onVnodeBeforeMount: (modelUpdateEvent) ? onVnodeBeforeMount : undefined
      };

      if ((props as any).onClick) {
        const oldClick = (props as any).onClick;
        propsToAdd.onClick = (ev: Event) => {
            oldClick(ev);
            if (!ev.defaultPrevented) {
                handleClick(ev);
            }
        };
      }

      if (modelProp) {
        propsToAdd = {
          ...propsToAdd,
          [modelProp]: props.hasOwnProperty('modelValue') ? props.modelValue : (props as any)[modelProp]
        }
      }

      return h(name, propsToAdd, slots.default && slots.default());
    }
  });

  Container.displayName = name;
  Container.props = componentProps;
  if (modelProp) {
    Container.props.push(MODEL_VALUE);
    Container.emits = [UPDATE_VALUE_EVENT];
  }
  if (routerLinkComponent) {
    Container.props.push(ROUTER_LINK_VALUE);
  }

  return Container;
};
