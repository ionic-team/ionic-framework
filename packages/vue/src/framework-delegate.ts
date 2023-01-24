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
    component: any,
    componentProps: any = {},
    classes?: string[]
  ) => {

    const div = document.createElement("div");
    classes && div.classList.add(...classes);
    parentElement.appendChild(div);

    const hostComponent = h(
      Teleport,
      { to: div },
      h(component, { ...componentProps })
    );

    refMap.set(component, hostComponent);

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
