import { FrameworkDelegate } from "@ionic/core/components";
import { render, unmountComponentAtNode } from "react-dom";

/**
 * The React Framework Delegate is an implementation of the FrameworkDelegate.
 * Responsible for managing how the framework creates, attaches, and removes components.
 */
export const ReactDelegate = (): FrameworkDelegate => {
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

    render(component(), div);

    container.appendChild(div);

    return div;
  }

  const removeViewFromDom = (_container: HTMLElement, component: HTMLElement): Promise<void> => {
    // Unmounts the React component from the DOM.
    unmountComponentAtNode(component);
    // Removes the removed view (html element) from the DOM.
    component.remove();

    return Promise.resolve();
  };

  return {
    attachViewToDom,
    removeViewFromDom,
  }
}
