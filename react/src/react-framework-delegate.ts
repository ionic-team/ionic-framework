import React from 'react';
import ReactDOM from 'react-dom';

import { FrameworkDelegate } from '@ionic/core';
import { isElementModal, isElementNav } from './utils/helpers';

export function attachViewToDom(parentElement: HTMLElement, reactComponent: any, propsOrData: any, classesToAdd: string[]) {
  const wrappingDiv = shouldWrapInIonPage(parentElement) ? document.createElement('ion-page') : document.createElement('div');
  if (classesToAdd) {
    for (const clazz of classesToAdd) {
      wrappingDiv.classList.add(clazz);
    }
  }

  parentElement.appendChild(wrappingDiv);

  // mount the React component
  const reactElement = React.createElement(reactComponent, propsOrData);
  ReactDOM.render(reactElement, wrappingDiv);

  return Promise.resolve(wrappingDiv);
}

export function removeViewFromDom(parentElement: HTMLElement, childElement: HTMLElement): Promise<any> {
  ReactDOM.unmountComponentAtNode(childElement);
  parentElement.removeChild(childElement);
  return Promise.resolve();
}

const Delegate: FrameworkDelegate = {
  attachViewToDom: attachViewToDom,
  removeViewFromDom: removeViewFromDom,
};

export { Delegate }


export function shouldWrapInIonPage(element: HTMLElement) {
  return isElementModal(element) || isElementNav(element);
}
