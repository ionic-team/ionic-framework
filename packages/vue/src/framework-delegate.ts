import { createVNode, render } from 'vue';

export const VueDelegate = () => {
  const attachViewToDom = (parentElement: HTMLElement, component: any, componentProps: any, classes?: string[]) => {
    /**
     * Ionic Framework passes in modal and popover element
     * refs as props, but if these are not defined
     * on the Vue component instance as props, Vue will
     * warn the user.
     */
    delete componentProps['modal'];
    delete componentProps['popover'];
    const vueInstance = createVNode(component, componentProps);

    const div = document.createElement('div');
    classes && div.classList.add(...classes);

    parentElement.appendChild(div);

    render(vueInstance, div);
  }

  const removeViewFromDom = (_: HTMLElement, childElement: any) => {
    render(null, childElement);
    return Promise.resolve();
  }

  return { attachViewToDom, removeViewFromDom }
}
