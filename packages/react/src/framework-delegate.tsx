import { FrameworkDelegate } from '@ionic/core/components';
import { cloneElement } from 'react';
import { createPortal } from 'react-dom';

export const ReactDelegate = (
  addView: (view: React.ReactElement) => void,
  removeView: (view: React.ReactElement) => void
): FrameworkDelegate => {
  let Component: React.ReactElement;

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

    Component = createPortal(componentWithProps, div);

    addView(Component);

    return Promise.resolve(div);
  };

  const removeViewFromDom = (): Promise<void> => {
    Component && removeView(Component);
    return Promise.resolve();
  };

  return {
    attachViewToDom,
    removeViewFromDom,
  };
};
