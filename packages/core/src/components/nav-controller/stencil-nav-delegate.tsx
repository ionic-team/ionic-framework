import { Component, Method } from '@stencil/core';

import { StencilElement } from '../..';
import { FrameworkDelegate, Nav, ViewController } from '../../navigation/nav-interfaces';

@Component({
  tag: 'stencil-ion-nav-delegate'
})
export class StencilNavDelegate implements FrameworkDelegate {

  @Method()
  attachViewToDom(nav: Nav, enteringView: ViewController): Promise<any> {
    return new Promise((resolve) => {
      const usersElement = document.createElement(enteringView.component);
      const ionPage = document.createElement('ion-page');
      enteringView.element = ionPage;
      ionPage.appendChild(usersElement);
      nav.element.appendChild(ionPage);
      (ionPage as StencilElement).componentOnReady(() => {
        resolve();
      });
    });
  }

  @Method()
  removeViewFromDom(nav: Nav, leavingView: ViewController): Promise<any> {
    nav.element.removeChild(leavingView.element);
    return Promise.resolve();
  }
}
