import { getWindow } from '@stencil/core';

export const createContext = <T>() => {
  const contexts = new WeakMap<any, Map<any, any>>();

  return {
    set<Value extends keyof T>(win: any, key: Value, value: T[Value]) {
      let ctx = contexts.get(win);
      if (ctx == null) {
        contexts.set(win, ctx = new Map());
      }
      ctx.set(key, value);
    },
    get<Value extends keyof T>(ref: any, key: Value): T[Value] {
      const ctx = contexts.get(getWindow(ref));
      return ctx != null ? ctx.get(key) : undefined;
    }
  };
};
