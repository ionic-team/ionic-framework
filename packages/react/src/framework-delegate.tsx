import { FrameworkDelegate } from '@ionic/core/components';
import { createPortal } from 'react-dom';

type ReactComponent = (props?: any) => JSX.Element;

export const ReactDelegate = (
  addView: (view: React.ReactElement) => void,
  removeView: (view: React.ReactElement) => void
): FrameworkDelegate => {
  const refMap = new WeakMap<ReactComponent, React.ReactElement>();

  const attachViewToDom = async (
    parentElement: HTMLElement,
    component: ReactComponent,
    propsOrDataObj?: any,
    cssClasses?: string[]
  ): Promise<any> => {
    if (component) {
      const div = document.createElement('div');
      cssClasses && div.classList.add(...cssClasses);
      parentElement.appendChild(div);
      /**
       * Attaching the component to the DOM is a two-step process.
       * 1. Create a React element from the component and supplied prop.
       * 2. Attach the React element to the DOM.
       *
       */
      const componentWithProps = component(propsOrDataObj);
      const hostComponent = createPortal(componentWithProps, div);
      refMap.set(component, hostComponent);
      addView(hostComponent);

      return Promise.resolve(div);
    }
  };

  const removeViewFromDom = (_container: any, component: ReactComponent): Promise<void> => {
    const hostComponent = refMap.get(component);
    hostComponent && removeView(hostComponent);

    return Promise.resolve();
  };

  return {
    attachViewToDom,
    removeViewFromDom,
  };
};

export const ReactTeleportDelegate = (): FrameworkDelegate => {
  let BaseComponent: HTMLElement;
  // let Reference: Comment;
  // let host: any;

  const attachViewToDom = async (
    _parentElement: HTMLElement,
    _component: ReactComponent,
    _propsOrDataObj?: any,
    _cssClasses?: string[]
  ): Promise<any> => {
    // BaseComponent = parentElement;
    // const app = document.querySelector('ion-app') || document.body;
    // Reference = document.createComment('ionic teleport');

    // if (BaseComponent.parentNode) {
    //   // BaseComponent.parentNode.insertBefore(Reference, BaseComponent);
    //   // app.appendChild(BaseComponent);
    //   createPortal(BaseComponent, app);
    // }

    // createPortal([], app);
    return Promise.resolve(BaseComponent);
  };

  const removeViewFromDom = (_container: any, _component: ReactComponent): Promise<void> => {
    // if (Reference) {
    //   if (Reference.parentNode && BaseComponent) {
    //     Reference.parentNode!.insertBefore(BaseComponent, Reference);
    //   }
    //   Reference.remove();
    // }
    return Promise.resolve();
  };

  return {
    attachViewToDom,
    removeViewFromDom,
  };
};
