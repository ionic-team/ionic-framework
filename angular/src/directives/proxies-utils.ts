/* tslint:disable */
import { fromEvent } from 'rxjs';

export const proxyInputs = (Cmp: any, inputs: string[]) => {
  const Prototype = Cmp.prototype;
  inputs.forEach(item => {
    Object.defineProperty(Prototype, item, {
      get() { return this.el[item]; },
      set(val: any) {
        this.z.runOutsideAngular(() => this.el[item] = val);
      },
    });
  });
};

export const proxyMethods = (Cmp: any, methods: string[]) => {
  const Prototype = Cmp.prototype;
  methods.forEach(methodName => {
    Prototype[methodName] = function() {
      const args = arguments;
      return this.z.runOutsideAngular(() => this.el[methodName].apply(this.el, args));
    };
  });
};

export const proxyOutputs = (instance: any, el: any, events: string[]) => {
  events.forEach(eventName => instance[eventName] = fromEvent(el, eventName));
};
