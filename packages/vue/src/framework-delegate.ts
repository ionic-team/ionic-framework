import { createVNode, render } from 'vue';

export const VueDelegate = () => {
  const attachViewToDom = (parentElement: HTMLElement, component: any, _: any, classes?: string[]) => {
    const vueInstance = createVNode(component);

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
