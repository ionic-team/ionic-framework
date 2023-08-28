import type { ComponentRef, FrameworkDelegate } from '../interface';

import { componentOnReady } from './helpers';

// TODO(FW-2832): types

export const attachComponent = async (
  delegate: FrameworkDelegate | undefined,
  container: Element,
  component?: ComponentRef,
  cssClasses?: string[],
  componentProps?: { [key: string]: any },
  inline?: boolean
): Promise<HTMLElement> => {
  if (delegate) {
    return delegate.attachViewToDom(container, component, componentProps, cssClasses);
  }
  if (!inline && typeof component !== 'string' && !(component instanceof HTMLElement)) {
    throw new Error('framework delegate is missing');
  }

  const el: any = typeof component === 'string' ? container.ownerDocument?.createElement(component) : component;

  if (cssClasses) {
    cssClasses.forEach((c) => el.classList.add(c));
  }
  if (componentProps) {
    Object.assign(el, componentProps);
  }

  container.appendChild(el);

  await new Promise((resolve) => componentOnReady(el, resolve));

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

export const CoreDelegate = () => {
  let BaseComponent: any;
  let Reference: any;
  const attachViewToDom = async (
    parentElement: HTMLElement,
    userComponent: any,
    userComponentProps: any = {},
    cssClasses: string[] = []
  ) => {
    BaseComponent = parentElement;
    let ChildComponent;
    /**
     * If passing in a component via the `component` props
     * we need to append it inside of our overlay component.
     */
    if (userComponent) {
      /**
       * If passing in the tag name, create
       * the element otherwise just get a reference
       * to the component.
       */
      const el: any =
        typeof userComponent === 'string' ? BaseComponent.ownerDocument?.createElement(userComponent) : userComponent;

      /**
       * Add any css classes passed in
       * via the cssClasses prop on the overlay.
       */
      cssClasses.forEach((c) => el.classList.add(c));

      /**
       * Add any props passed in
       * via the componentProps prop on the overlay.
       */
      Object.assign(el, userComponentProps);

      /**
       * Finally, append the component
       * inside of the overlay component.
       */
      BaseComponent.appendChild(el);

      ChildComponent = el;

      await new Promise((resolve) => componentOnReady(el, resolve));
    } else if (
      BaseComponent.children.length > 0 &&
      (BaseComponent.tagName === 'ION-MODAL' || BaseComponent.tagName === 'ION-POPOVER')
    ) {
      /**
       * The delegate host wrapper el is only needed for modals and popovers
       * because they allow the dev to provide custom content to the overlay.
       */
      const root = ChildComponent = BaseComponent.children[0] as HTMLElement;
      if (!root.classList.contains('ion-delegate-host')) {
        /**
         * If the root element is not a delegate host, it means
         * that the overlay has not been presented yet and we need
         * to create the containing element with the specified classes.
         */
        const el = BaseComponent.ownerDocument?.createElement('div');
        // Add a class to track if the root element was created by the delegate.
        el.classList.add('ion-delegate-host');
        cssClasses.forEach((c) => el.classList.add(c));
        // Move each child from the original template to the new parent element.
        el.append(...BaseComponent.children);
        // Append the new parent element to the original parent element.
        BaseComponent.appendChild(el);
        ChildComponent = el;
      }
    }

    /**
     * Get the root of the app and
     * add the overlay there.
     */
    const app = document.querySelector('ion-app') || document.body;

    /**
     * Create a placeholder comment so that
     * we can return this component to where
     * it was previously.
     */
    Reference = document.createComment('ionic teleport');
    BaseComponent.parentNode.insertBefore(Reference, BaseComponent);

    app.appendChild(BaseComponent);

    return ChildComponent;
  };

  const removeViewFromDom = () => {
    /**
     * Return component to where it was previously in the DOM.
     */
    if (BaseComponent && Reference) {
      Reference.parentNode.insertBefore(BaseComponent, Reference);
      Reference.remove();
    }
    return Promise.resolve();
  };

  return { attachViewToDom, removeViewFromDom };
};
