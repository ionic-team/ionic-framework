import type { FrameworkDelegate } from '@ionic/core/components';
import { createPortal } from 'react-dom';

import { generateId } from './utils/generateId';

// TODO(FW-2959): types

type ReactComponent = (props?: any) => JSX.Element;

export const ReactDelegate = (
  addView: (view: React.ReactElement) => void,
  removeView: (view: React.ReactElement) => void
): FrameworkDelegate => {
  const refMap = new WeakMap<HTMLElement, React.ReactElement>();
  const reactDelegateId = `react-delegate-${generateId()}`;
  // Incrementing counter to generate unique keys for each view
  let id = 0;

  const attachViewToDom = async (
    parentElement: HTMLElement,
    component: ReactComponent,
    propsOrDataObj?: any,
    cssClasses?: string[]
  ): Promise<any> => {
    const div = document.createElement('div');
    cssClasses && div.classList.add(...cssClasses);
    parentElement.appendChild(div);

    const componentWithProps = component(propsOrDataObj);
    const key = `${reactDelegateId}-${id++}`;
    const hostComponent = createPortal(componentWithProps, div, key);

    refMap.set(div, hostComponent);

    addView(hostComponent);

    return Promise.resolve(div);
  };

  const removeViewFromDom = (_container: any, component: HTMLElement): Promise<void> => {
    const hostComponent = refMap.get(component);
    hostComponent && removeView(hostComponent);

    component.remove();

    return Promise.resolve();
  };

  return {
    attachViewToDom,
    removeViewFromDom,
  };
};
