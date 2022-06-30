import React from 'react';
import { FrameworkDelegate } from '@ionic/core/components';
/**
 * The React Framework Delegate is an implementation of the FrameworkDelegate.
 * Responsible for managing how the framework creates, attaches, and removes components.
 */
export const ReactDelegate = (
  addView: (view: any) => void,
  removeView: (view: Element) => void
): FrameworkDelegate => {
  let view: any;

  const attachViewToDom = async (
    _parentElement: HTMLElement,
    component: any,
    _propsOrDataObj?: any,
    cssClasses?: string[]
  ): Promise<any> => {
    const ref = React.createRef<HTMLDivElement>();

    view = (
      // TODO - We could swap this out with IonPage (doesn't really change anything)
      <div ref={ref} className={cssClasses && cssClasses.join(' ')}>
        {component()}
      </div>
    );

    /**
     * Callback to add the view to the React component instance.
     * This allows us to render components within React's context.
     */
    addView(view);

    return ref.current;
  };

  const removeViewFromDom = (_container: HTMLElement, component: HTMLElement): Promise<void> => {
    // Remove view still needs work, back navigation will through an assert error
    if (view) {
      removeView(view);
    }
    component.remove();

    return Promise.resolve();
  };

  return {
    attachViewToDom,
    removeViewFromDom,
  };
};
