import { createVNode, render } from 'vue';

export const VueDelegate = () => {
  const attachViewToDom = (parentElement: HTMLElement, component: any, opts?: any, classes?: string[]) => {
    const vueInstance = createVNode(component, opts);

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
