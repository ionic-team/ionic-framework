import { FrameworkDelegate, Nav, ViewController } from '../../index';

export class DomFrameworkDelegate implements FrameworkDelegate {
  attachViewToDom(nav: Nav, enteringView: ViewController): Promise<any> {
    return new Promise((resolve) => {
      const usersElement = document.createElement(enteringView.component) as HTMLElement;
      usersElement.classList.add('ion-page');
      enteringView.element = usersElement;
      nav.element.appendChild(usersElement);
      resolve();
    });
  }

  removeViewFromDom(nav: Nav, leavingView: ViewController): Promise<any> {
    nav.element.removeChild(leavingView.element);
    return Promise.resolve();
  }
}
