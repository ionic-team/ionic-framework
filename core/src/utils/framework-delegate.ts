import { ComponentRef } from '..';

export interface FrameworkDelegate {
  attachViewToDom(container: any, component: any, propsOrDataObj?: any, cssClasses?: string[]): Promise<HTMLElement>;
  removeViewFromDom(container: any, component: any): Promise<void>;
}

export function attachComponent(delegate: FrameworkDelegate|undefined, container: Element, component: ComponentRef, cssClasses?: string[], componentProps?: {[key: string]: any}): Promise<HTMLElement> {
  if (delegate) {
    return delegate.attachViewToDom(container, component, componentProps, cssClasses);
  }
  if (typeof component !== 'string' && !(component instanceof HTMLElement)) {
    throw new Error('framework delegate is missing');
  }

  const el = (typeof component === 'string')
    ? container.ownerDocument.createElement(component)
    : component;

  cssClasses && cssClasses.forEach(c => el.classList.add(c));
  componentProps && Object.assign(el, componentProps);

  container.appendChild(el);
  if ((el as any).componentOnReady) {
    return (el as any).componentOnReady();
  }
  return Promise.resolve(el);
}

export function detachComponent(delegate: FrameworkDelegate|undefined, element: HTMLElement|undefined) {
  if (element) {
    if (delegate) {
      const container = element.parentElement;
      return delegate.removeViewFromDom(container, element);
    }
    element.remove();
  }
  return Promise.resolve();
}
