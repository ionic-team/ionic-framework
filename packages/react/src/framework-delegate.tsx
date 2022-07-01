import { FrameworkDelegate } from '@ionic/core/components';
import { createPortal } from 'react-dom';

export const ReactDelegate = (
  addView: (view: JSX.Element) => void,
  removeView: (view: JSX.Element) => void
): FrameworkDelegate => {

  // TODO: Type
  let Component: any;

  const attachViewToDom = async (
    parentElement: HTMLElement,
    component: () => JSX.Element,
    _propsOrDataObj?: any,
    cssClasses?: string[]
  ): Promise<any> => {

    const div = document.createElement('div');
    cssClasses && div.classList.add(...cssClasses);
    parentElement.appendChild(div);

    /**
     * You don't necessarily need to use a portal
     * here, but it seems to make life a bit simpler.
     */
    Component = createPortal(component(), div);

    // TODO: Pass props to child component

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
