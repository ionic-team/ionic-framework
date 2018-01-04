import { FrameworkDelegate, FrameworkMountingData, } from '../index';
import { isElementModal, isElementNav, isString } from './helpers';

export class DomFrameworkDelegate implements FrameworkDelegate {

  attachViewToDom(parentElement: HTMLElement, tagOrElement: string | HTMLElement, propsOrDataObj: any = {}, classesToAdd: string[] = []): Promise<FrameworkMountingData> {
    return new Promise((resolve) => {
      const usersElement = (isString(tagOrElement) ? document.createElement(tagOrElement) : tagOrElement) as HTMLElement;
      Object.assign(usersElement, propsOrDataObj);

      if (classesToAdd.length) {
        for (const clazz of classesToAdd) {
          usersElement.classList.add(clazz);
        }
      }

      const elementToAppend = shouldWrapInIonPage(parentElement) ? createIonPageAndAppendUserElement(usersElement) : usersElement;
      parentElement.appendChild(elementToAppend);

      resolve({
        element: elementToAppend
      });
    });
  }

  removeViewFromDom(parentElement: HTMLElement, childElement: HTMLElement): Promise<FrameworkMountingData> {
    parentElement.removeChild(childElement);
    return Promise.resolve({
      element: null
    });
  }
}

export function shouldWrapInIonPage(element: HTMLElement) {
  return isElementModal(element) || isElementNav(element);
}

export function createIonPageAndAppendUserElement(userElement: HTMLElement) {
  const wrappingElement = document.createElement('ion-page');
  wrappingElement.appendChild(userElement);
  return wrappingElement;
}
