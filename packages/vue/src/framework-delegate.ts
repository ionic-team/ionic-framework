import { h, Teleport, VNode } from 'vue';
import { addTeleportedUserComponent, removeTeleportedUserComponent } from './components/IonApp';
export const VueDelegate = (addFn = addTeleportedUserComponent, removeFn = removeTeleportedUserComponent) => {
  let Component: VNode | undefined;
  const attachViewToDom = (parentElement: HTMLElement, component: any, componentProps: any = {}, classes?: string[]) => {
    const div = document.createElement('div');
    classes && div.classList.add(...classes);
    parentElement.appendChild(div);

    Component = h(
      Teleport,
      { to: div },
      h(component, { ...componentProps })
    );

    addFn(Component);

    return div;
  }

  const removeViewFromDom = () => {
    Component && removeFn(Component);
    return Promise.resolve();
  }

  return { attachViewToDom, removeViewFromDom }
}
