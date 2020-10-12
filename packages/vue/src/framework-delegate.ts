import { h, Teleport, VNode } from 'vue';
import { addTeleportedUserComponent, removeTeleportedUserComponent } from './components/IonApp';
export const VueDelegate = () => {
  let Component: VNode | undefined;
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

    addTeleportedUserComponent(Component);

    return div;
  }

  const removeViewFromDom = () => {
    Component && removeTeleportedUserComponent(Component);
    return Promise.resolve();
  }

  return { attachViewToDom, removeViewFromDom }
}
