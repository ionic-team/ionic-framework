import type { IonicConfig } from "@ionic/core/components";
import { initialize } from "@ionic/core/components";
import type { App, Plugin } from "vue";

// TODO(FW-2969): types

/**
 * We need to make sure that the web component fires an event
 * that will not conflict with the user's @ionChange binding,
 * otherwise the binding's callback will fire before any
 * v-model values have been updated.
 */
const toKebabCase = (eventName: string) => {
  const kebabConvert = (name: string) => name.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2").toLowerCase();

  return kebabConvert(eventName);
};

const getHelperFunctions = () => {
  return {
    ael: (el: any, eventName: string, cb: any, opts: any) =>
      el.addEventListener(toKebabCase(eventName), cb, opts),
    rel: (el: any, eventName: string, cb: any, opts: any) =>
      el.removeEventListener(toKebabCase(eventName), cb, opts),
    ce: (eventName: string, opts: any) =>
      new CustomEvent(toKebabCase(eventName), opts),
  };
};

export const IonicVue: Plugin = {
  async install(_: App, config: IonicConfig = {}) {
    /**
     * By default Ionic Framework hides elements that
     * are not hydrated, but in the CE build there is no
     * hydration.
     * TODO FW-2797: Remove when all integrations have been
     * migrated to CE build.
     */
    if (typeof (document as any) !== "undefined") {
      document.documentElement.classList.add("ion-ce");
    }

    const { ael, rel, ce } = getHelperFunctions();
    initialize({
      ...config,
      _ael: ael,
      _rel: rel,
      _ce: ce,
    });
  },
};
