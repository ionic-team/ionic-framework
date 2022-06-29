import { FrameworkDelegate } from "@ionic/core/components";
import { render, unmountComponentAtNode } from "react-dom";

/**
 * The React Framework Delegate is an implementation of the FrameworkDelegate.
 * Responsible for managing how the framework creates, attaches, and removes components.
 */
export const ReactDelegate = (addFn: (component: Element) => void, removeFn: (component: Element) => void): FrameworkDelegate => {
  const attachViewToDom = async (
    container: HTMLElement,
    component: any,
    _propsOrDataObj?: any,
    cssClasses?: string[]
  ): Promise<any> => {
    /**
     * Creates an HTMLElement reference from the React component. Appends the created element
     * to the parent element container.
     *
     * TODO: When updating to support React 18, we will need to replace `render` with `createRoot`.
     * ```
     * const root = createRoot(container);
     * const componentEl = root.render(component);
     * ```
     */
    const div = document.createElement('div');
    cssClasses && div.classList.add(...cssClasses);

    const el = render(component(), div);

    container.appendChild(div);

    addFn(el);

    return div;
  }

  const removeViewFromDom = (container: HTMLElement, component: HTMLElement): Promise<void> => {
    console.log('removeViewFromDom', {
      container,
      component,
    });
    unmountComponentAtNode(component);
    component && removeFn(component);

    component.remove();

    return Promise.resolve();
  };

  return {
    attachViewToDom,
    removeViewFromDom,
  }
}
