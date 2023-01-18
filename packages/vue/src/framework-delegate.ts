import type { FrameworkDelegate } from '@ionic/core/components';
import type { VNode } from 'vue';
import { h, Teleport } from 'vue';

import { addTeleportedUserComponent, removeTeleportedUserComponent } from './components/IonApp';

export const VueDelegate = (addFn = addTeleportedUserComponent, removeFn = removeTeleportedUserComponent): FrameworkDelegate => {
  let Component: VNode | undefined;
  // TODO(FW-2969): types
  const attachViewToDom = (parentElement: HTMLElement, component: any, componentProps: any = {}, classes?: string[]) => {
    /**
     * Ionic Framework passes in modal and popover element
     * refs as props, but if these are not defined
     * on the Vue component instance as props, Vue will
     * warn the user.
     */
    delete componentProps['modal'];
    delete componentProps['popover'];

    const div = document.createElement('div');
    classes && div.classList.add(...classes);
    parentElement.appendChild(div);

    Component = h(
      Teleport,
      { to: div },
      h(component, { ...componentProps })
    );

    addFn(Component);

    return Promise.resolve(div);
  }

  const removeViewFromDom = () => {
    Component && removeFn(Component);
    return Promise.resolve();
  }

  return { attachViewToDom, removeViewFromDom }
}
