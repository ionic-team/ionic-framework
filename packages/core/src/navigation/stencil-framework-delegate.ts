import { NavController, ViewController } from './nav-interfaces';

export function attachViewToDom(nav: NavController, enteringView: ViewController): Promise<any> {
  return new Promise((resolve) => {
    const usersElement = document.createElement(enteringView.component);
    const ionPage = document.createElement('ion-page');
    enteringView.element = ionPage;
    ionPage.appendChild(usersElement);
    (ionPage as any).componentDidLoad = () => {
      resolve();
    };

    nav.element.appendChild(ionPage);
  });
}

export function removeViewFromDom(nav: NavController, leavingView: ViewController): Promise<any> {
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