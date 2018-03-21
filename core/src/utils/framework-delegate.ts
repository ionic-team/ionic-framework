
export interface FrameworkDelegate {
  attachViewToDom(container: any, component: any, propsOrDataObj?: any, cssClasses?: string[]): Promise<HTMLElement>;
  removeViewFromDom(container: any, component: any): Promise<void>;
}

export function attachComponent(delegate: FrameworkDelegate, container: Element, component: string|HTMLElement, cssClasses?: string[], params?: {[key: string]: any}): Promise<HTMLElement> {
  if (delegate) {
    return delegate.attachViewToDom(container, component, params, cssClasses);
  }
  const el = (typeof component === 'string') ? document.createElement(component) : component;

  cssClasses && cssClasses.forEach(c => el.classList.add(c));
  params && Object.assign(el, params);

  container.appendChild(el);
  if ((el as any).componentOnReady) {
    return (el as any).componentOnReady();
  }
  return Promise.resolve(el);
}

export function detachComponent(delegate: FrameworkDelegate, element: HTMLElement) {
  if (element) {
    if (delegate) {
      const container = element.parentElement;
      return delegate.removeViewFromDom(container, element);
    }
    element.remove();
  }
  return Promise.resolve();
}
