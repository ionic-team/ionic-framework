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
    const div = document.createElement('div');
    cssClasses && div.classList.add(...cssClasses);
    parentElement.appendChild(div);

    const componentWithProps = component(propsOrDataObj);
    const hostComponent = createPortal(componentWithProps, div);

    refMap.set(component, hostComponent);

    addView(hostComponent);

    return Promise.resolve(div);
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

export const ReactInlineOverlayDelegate = (): FrameworkDelegate => {
  const teleport = document.createComment('ionic teleport');
  let inlineOverlay: HTMLElement;

  const attachViewToDom = async (
    parentElement: HTMLElement,
    _component: ReactComponent,
    _propsOrDataObj?: any,
    _cssClasses?: string[]
  ): Promise<any> => {
    /**
     * Inline overlays operate in a special way. Since the overlay is
     * rendered as a child of a component, we need to "teleport" the
     * DOM node to the app root so that it is rendered above all other
     * components.
     */
    inlineOverlay = parentElement;

    const appRoot = document.querySelector('ion-app') || document.body;
    const fragment = document.createDocumentFragment();

    inlineOverlay.parentElement?.insertBefore(teleport, inlineOverlay);

    fragment.appendChild(inlineOverlay);
    appRoot.appendChild(fragment);

    return fragment;
  };

  const removeViewFromDom = async (
    _container: HTMLElement,
    _component: ReactComponent
  ): Promise<void> => {
    /**
     * We need to re-insert the inline overlay back into the
     * original location in the DOM, before it was presented.
     */
    teleport.parentElement?.insertBefore(inlineOverlay, teleport);
    // Remove the HTML comment marking the teleport location.
    teleport.remove();
  };

  return {
    attachViewToDom,
    removeViewFromDom,
  };
};
