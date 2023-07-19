import type { FrameworkDelegate } from '@ionic/core/components';
import { createPortal } from 'react-dom';

// TODO(FW-2959): types

type ReactComponent = (props?: any) => JSX.Element;

export const ReactDelegate = (
  addView: (view: React.ReactElement) => void,
  removeView: (view: React.ReactElement) => void,
  nextID?: () => number
): FrameworkDelegate => {
  const refMap = new WeakMap<HTMLElement, React.ReactElement>();

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
    const hostComponent = createPortal(componentWithProps, div, nextID?.());

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
