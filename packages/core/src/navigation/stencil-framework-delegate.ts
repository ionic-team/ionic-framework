import { Nav, ViewController } from './nav-interfaces';

export function attachViewToDom(nav: Nav, enteringView: ViewController): Promise<any> {
  return new Promise((resolve) => {
    const usersElement = document.createElement(enteringView.component);
    const ionPage = document.createElement('ion-page');
    enteringView.element = ionPage;
    ionPage.appendChild(usersElement);
    if (!(ionPage as any)._onReadyCallbacks) {
      (ionPage as any)._onReadyCallbacks = [];
    }
    const callback = () => {
      resolve();
    };
    (ionPage as any)._onReadyCallbacks.push(callback)
    nav.element.appendChild(ionPage);
  });
}

export function removeViewFromDom(nav: Nav, leavingView: ViewController): Promise<any> {
  nav.element.removeChild(leavingView.element);
  return Promise.resolve();
}

export function destroy(_viewController: ViewController) {
  return Promise.resolve();
}

const delegate = {
  attachViewToDom: attachViewToDom,
  removeViewFromDom: removeViewFromDom,
  destroy: destroy
};

export { delegate };