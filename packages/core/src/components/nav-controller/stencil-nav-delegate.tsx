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
      const usersElement = document.createElement(enteringView.component) as HTMLElement;
      usersElement.classList.add('ion-page');
      enteringView.element = usersElement;
      nav.element.appendChild(usersElement);
      resolve();
    });
  }

  @Method()
  removeViewFromDom(nav: Nav, leavingView: ViewController): Promise<any> {
    nav.element.removeChild(leavingView.element);
    return Promise.resolve();
  }
}
