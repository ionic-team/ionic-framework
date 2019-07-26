import { ComponentRef, FrameworkDelegate } from '../interface';

export const attachComponent = async (
  delegate: FrameworkDelegate | undefined,
  container: Element,
  component: ComponentRef,
  cssClasses?: string[],
  componentProps?: { [key: string]: any }
): Promise<HTMLElement> => {
  if (delegate) {
    return delegate.attachViewToDom(container, component, componentProps, cssClasses);
  }
  if (typeof component !== 'string' && !(component instanceof HTMLElement)) {
    throw new Error('framework delegate is missing');
  }

  const el: any = (typeof component === 'string')
    ? container.ownerDocument && container.ownerDocument.createElement(component)
    : component;

  if (cssClasses) {
    cssClasses.forEach(c => el.classList.add(c));
  }
  if (componentProps) {
    Object.assign(el, componentProps);
  }

  container.appendChild(el);
  if (el.componentOnReady) {
    await el.componentOnReady();
  }
  return el;
};

export const detachComponent = (delegate: FrameworkDelegate | undefined, element: HTMLElement | undefined) => {
  if (element) {
    if (delegate) {
      const container = element.parentElement;
      return delegate.removeViewFromDom(container, element);
    }
    element.remove();
  }
  return Promise.resolve();
};
