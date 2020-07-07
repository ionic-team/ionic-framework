import Vue, { VNode, CreateElement } from 'vue';

export const createCommonRender = (tagName: string, eventNames: string[] = []) =>
  function (createElement: CreateElement): VNode {
    const vueElement = this as Vue;
    const allListeners = eventNames.reduce((listeners, eventName) => {
      return {
        ...listeners,
        [eventName]: (event: CustomEvent<any>) => {
          let emittedValue = event.detail;
          if (event.detail.value) {
            emittedValue = event.detail.value;
          }
          vueElement.$emit(eventName, emittedValue);
        },
      };
    }, vueElement.$listeners);

    return createElement(
      tagName,
      {
        ref: 'wc',
        domProps: vueElement.$props,
        on: allListeners,
      },
      [vueElement.$slots.default],
    );
  };

export const createCommonMethod = (methodName: string) =>
  function (...args: any[]) {
    this.$refs.wc[methodName](...args);
  } as unknown;
