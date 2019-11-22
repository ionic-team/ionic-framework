/* tslint:disable */
import { fromEvent } from 'rxjs';
import { TypeDecorator } from '@angular/core';

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
    Prototype[methodName] = function() {
      const args = arguments;
      return this.z.runOutsideAngular(() =>
        this.el[methodName].apply(this.el, args)
      );
    };
  });
};

export const proxyOutputs = (instance: any, el: any, events: string[]) => {
  events.forEach(eventName => (instance[eventName] = fromEvent(el, eventName)));
};

export function ProxyCmp(opts: { inputs?: any; outputs?: any; methods?: any }) {
  const typeDecorator: TypeDecorator = <TypeDecorator>(
    function TypeDecorator(cls: any) {
      if (opts.inputs) {
        proxyInputs(cls, opts.inputs);
      }
      if (opts.methods) {
        proxyMethods(cls, opts.methods);
      }
      if (opts.outputs) {
        proxyOutputs(cls, cls.el, opts.outputs);
      }
      return cls;
    }
  );
  return typeDecorator;
}
