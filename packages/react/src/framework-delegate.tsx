import { FrameworkDelegate } from '@ionic/core/components';
import { createPortal } from 'react-dom';

export const ReactDelegate = (
  addView: (view: React.ReactPortal) => void,
  removeView: (view: React.ReactPortal) => void
): FrameworkDelegate => {
  let Component: React.ReactPortal;

  const attachViewToDom = async (
    parentElement: HTMLElement,
    component: () => JSX.Element,
    propsOrDataObj?: any,
    cssClasses?: string[]
  ): Promise<any> => {
    const div = document.createElement('div');
    cssClasses && div.classList.add(...cssClasses);
    parentElement.appendChild(div);

    Component = createPortal(component(), div);

    Component.props = propsOrDataObj;

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
