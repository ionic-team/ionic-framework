import { FunctionalComponent, h } from 'vue';

export const defineContainer = <Props extends object>(name: string, componentProps: string[]) => {
  const Container: FunctionalComponent<Props> = (props, { slots }) =>
    h(name, props, slots.default && slots.default());

  Container.displayName = name;
  Container.props = componentProps;

  return Container;
};
