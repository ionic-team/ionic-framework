import React from 'react';
import { FrameworkDelegate } from '@ionic/core/components';
/**
 * The React Framework Delegate is an implementation of the FrameworkDelegate.
 * Responsible for managing how the framework creates, attaches, and removes components.
 */
let attachViewCounter = 0;

const delegateViews: {
  view: JSX.Element;
  el: HTMLElement | HTMLDivElement;
}[] = [];

const addViewToMemory = (view: JSX.Element, el: HTMLElement | HTMLDivElement) => {
  delegateViews.push({
    view,
    el,
  });
};

export const ReactDelegate = (
  addView: (view: JSX.Element) => void,
  removeView: (view: JSX.Element) => void
): FrameworkDelegate => {
  let view: JSX.Element;

  const attachViewToDom = async (
    _parentElement: HTMLElement,
    component: () => JSX.Element,
    _propsOrDataObj?: any,
    cssClasses?: string[]
  ): Promise<any> => {
    // Creates a ref that will resolve the HTML Element of the component.
    const ref = React.createRef<HTMLDivElement>();
    // Unique key for the component.
    const key = ++attachViewCounter;

    view = (
      <div key={key} ref={ref} className={cssClasses && cssClasses.join(' ')}>
        {component()}
      </div>
    );

    /**
     * Callback to allow the parent React component to render
     * the new component within its context.
     */
    addView(view);

    addViewToMemory(view, ref.current!);

    // Return the HTML Element value of the component.
    return ref.current;
  };

  const removeViewFromDom = (_container: HTMLElement, component: HTMLElement): Promise<void> => {
    console.log('removeViewFromDom', {
      container: _container,
      component,
    });

    const viewIndex = delegateViews.findIndex((v) => v.el === component);

    if (viewIndex > -1) {
      console.log('removing view', delegateViews[viewIndex]);
      removeView(delegateViews[viewIndex].view);
      delegateViews.splice(viewIndex, 1);
    }

    return Promise.resolve();
  };

  return {
    attachViewToDom,
    removeViewFromDom,
  };
};
