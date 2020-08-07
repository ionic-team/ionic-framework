import { FunctionalComponent, VNode, h, inject } from 'vue';

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
export const defineContainer = <Props extends object>(name: string, componentProps: string[], componentOptions: ComponentOptions = {}) => {
  const { modelProp, modelUpdateEvent, routerLinkComponent } = componentOptions;

  /**
  * Create a Vue component wrapper around a Web Component.
  * Note: The `props` here are not all properties on a component.
  * They refer to whatever properties are set on an instance of a component.
  */
  const Container: FunctionalComponent<Props & InputProps> = (props, { slots, emit }) => {
    const { modelValue, ...restOfProps } = props;
    let finalProps: any = (modelProp) ? (
      {
        ...restOfProps,
        [modelProp]: props.hasOwnProperty(MODEL_VALUE) ? modelValue : (props as any)[modelProp],
      }
    ) : restOfProps;


    if (modelUpdateEvent) {
      const onVnodeBeforeMount = (vnode: VNode) => {

        // Add a listener to tell Vue to update the v-model
        if (vnode.el) {
          vnode.el.addEventListener(modelUpdateEvent.toLowerCase(), (e: Event) => {
            emit(UPDATE_VALUE_EVENT, (e?.target as any)[modelProp]);
          });
        }
      };

      finalProps = {
        ...finalProps,
        onVnodeBeforeMount
      }
    }

    if (routerLinkComponent) {
      const navManager: NavManager = inject(NAV_MANAGER);
      const handleClick = (ev: Event) => {
        const routerProps = Object.keys(finalProps).filter(p => p.startsWith(ROUTER_PROP_REFIX));
        if (routerProps.length === 0) return;

        let navigationPayload: any = { event: ev };
        routerProps.forEach(prop => {
          navigationPayload[prop] = finalProps[prop];
        });
        navManager.navigate(navigationPayload);
      }

      if (finalProps.onClick) {
        const oldClick = finalProps.onClick;
        finalProps.onClick = (ev: Event) => {
          oldClick(ev);
          if (!ev.defaultPrevented) {
            handleClick(ev);
          }
        }
      } else {
        finalProps.onClick = handleClick;
      }
    }

    return h(
      name,
      finalProps,
      slots.default && slots.default()
    );
  }

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
