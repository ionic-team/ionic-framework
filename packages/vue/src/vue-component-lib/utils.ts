import { FunctionalComponent, VNode, h } from 'vue';

export interface InputProps extends Object {
  modelValue: string | boolean;
}

export const defineContainer = <Props extends object>(name: string, componentProps: string[], modelProp?: string, modelUpdateEvent?: string) => {
  const Container: FunctionalComponent<Props & InputProps> = (props, { slots, emit }) => {
    const { modelValue, ...restOfProps } = props;
    let finalProps = (modelProp) ? (
      {
        ...restOfProps,
        [modelProp]: props.hasOwnProperty('modelValue') ? modelValue : (props as any)[modelProp],
      }
    ) : restOfProps;


    if (modelUpdateEvent) {
      const onVnodeBeforeMount = (vnode: VNode) => {
        if (vnode.el) {
          vnode.el.addEventListener(modelUpdateEvent.toLowerCase(), (e: Event) => {
            emit('update:modelValue', (e?.target as any)[modelProp]);
          });
        }
      };

      finalProps = {
        ...finalProps,
        onVnodeBeforeMount
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
    console.log('Component has modelProp, adding emits');
    Container.props = [...componentProps, 'modelValue'];
    Container.emits = ['update:modelValue'];
  }

  return Container;
};
