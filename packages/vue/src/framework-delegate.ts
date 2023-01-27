import type { FrameworkDelegate } from "@ionic/core/components";
import type { VNode } from "vue";
import { h, Teleport } from "vue";

import {
  addTeleportedUserComponent,
  removeTeleportedUserComponent,
} from "./components/IonApp";

export const VueDelegate = (
  addFn = addTeleportedUserComponent,
  removeFn = removeTeleportedUserComponent
): FrameworkDelegate => {
  // `h` doesn't provide a type for the component argument
  const refMap = new WeakMap<any, VNode>();

  // TODO(FW-2969): types
  const attachViewToDom = (
    parentElement: HTMLElement,
    componentOrTagName: any | string,
    componentProps: any = {},
    classes?: string[]
  ) => {
    /**
     * Ionic Framework passes in modal and popover element
     * refs as props, but if these are not defined
     * on the Vue component instance as props, Vue will
     * warn the user.
     */
    delete componentProps["modal"];
    delete componentProps["popover"];

    const div = document.createElement("div");
    classes && div.classList.add(...classes);
    parentElement.appendChild(div);

    const hostComponent = h(
      Teleport,
      { to: div },
      h(componentOrTagName, { ...componentProps })
    );

    /**
     * Ionic Framework will use what is returned from `attachViewToDom`
     * as the `component` argument in `removeViewFromDom`.
     *
     * We will store a reference to the div element and the host component,
     * so we can later look-up and unmount the correct instance.
     */
    refMap.set(div, hostComponent);

    addFn(hostComponent);

    return Promise.resolve(div);
  };

  const removeViewFromDom = (_container: any, component: any) => {
    const hostComponent = refMap.get(component);
    hostComponent && removeFn(hostComponent);

    return Promise.resolve();
  };

  return { attachViewToDom, removeViewFromDom };
};
