/* eslint-disable */
/* tslint:disable */
import { fromEvent } from 'rxjs';

export const proxyInputs = (Cmp: any, inputs: string[]) => {
  const Prototype = Cmp.prototype;

  inputs.forEach(item => {
    Object.defineProperty(Prototype, item, {
      get() {
        return this.el[item];
      },
      set(val: any) {
        this.z.runOutsideAngular(() => (this.el[item] = val));
      }
    });
  });
};

export const proxyMethods = (Cmp: any, methods: string[]) => {
  const Prototype = Cmp.prototype;
  methods.forEach(methodName => {
    Prototype[methodName] = function () {
      const args = arguments;
      return this.z.runOutsideAngular(() =>
        this.el[methodName].apply(this.el, args)
      );
    };
  });
};

export const proxyOutputs = (instance: any, el: any, events: string[]) => {
  events.forEach(eventName => instance[eventName] = fromEvent(el, eventName));
}

export const defineCustomElement = (tagName: string, customElement: any) => {
  if (
    customElement !== undefined &&
    typeof customElements !== 'undefined' &&
    !customElements.get(tagName)
  ) {
    customElements.define(tagName, customElement);
  }
}

const NG_COMP_DEF = 'ɵcmp';

export const clearAngularOutputBindings = (cls: any) => {
  const instance = cls.prototype.constructor;
  if (instance[NG_COMP_DEF]) {
    /**
     * With the output targets generating @Output() proxies, we need to
     * clear the metadata (ɵcmp.outputs) so that Angular does not add its own event listener
     * and cause duplicate event emissions for the web component events.
     */
    instance[NG_COMP_DEF].outputs = {};
  }
};

// tslint:disable-next-line: only-arrow-functions
export function ProxyCmp(opts: { defineCustomElementFn?: () => void, inputs?: any; methods?: any }) {
  const decorator = function (cls: any) {
    const { defineCustomElementFn, inputs, methods } = opts;

    if (defineCustomElementFn !== undefined) {
      defineCustomElementFn();
    }

    clearAngularOutputBindings(cls);

    if (inputs) {
      proxyInputs(cls, inputs);
    }
    if (methods) {
      proxyMethods(cls, methods);
    }
    return cls;
  };
  return decorator;
}
