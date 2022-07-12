import { cloneElement } from 'react';
import { createPortal } from 'react-dom';

import { FrameworkDelegate } from '@ionic/core/components';

export const ReactDelegate = (
  addView: (view: React.ReactElement) => void,
  removeView: (view: React.ReactElement) => void
): FrameworkDelegate => {
  const refMap = new WeakMap<() => JSX.Element, React.ReactElement>();

  const attachViewToDom = async (
    parentElement: HTMLElement,
    component: () => JSX.Element,
    propsOrDataObj?: any,
    cssClasses?: string[]
  ): Promise<any> => {
    const div = document.createElement('div');
    cssClasses && div.classList.add(...cssClasses);
    parentElement.appendChild(div);

    const componentWithProps = cloneElement(component(), propsOrDataObj);
    const hostComponent = createPortal(componentWithProps, div);

    refMap.set(component, hostComponent);

    addView(hostComponent);

    return Promise.resolve(div);
  };

  const removeViewFromDom = (_container: any, component: any): Promise<void> => {
    const hostComponent = refMap.get(component);
    hostComponent && removeView(hostComponent);

    return Promise.resolve();
  };

  return {
    attachViewToDom,
    removeViewFromDom,
  };
};
