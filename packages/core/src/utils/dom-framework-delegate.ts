import { FrameworkDelegate, FrameworkMountingData, } from '../index';
import { isString } from './helpers';

export class DomFrameworkDelegate implements FrameworkDelegate {

  attachViewToDom(parentElement: HTMLElement, tagOrElement: string | HTMLElement, data: any = {}, classesToAdd: string[] = []): Promise<FrameworkMountingData> {
    return new Promise((resolve) => {
      const usersElement = (isString(tagOrElement) ? document.createElement(tagOrElement) : tagOrElement);
      Object.assign(usersElement, data);

      if (classesToAdd.length) {
        for (const clazz of classesToAdd) {
          usersElement.classList.add(clazz);
        }
      }

      parentElement.appendChild(usersElement);

      resolve({
        element: usersElement,
        data: data,
        component: tagOrElement
      });
    });
  }

  removeViewFromDom(parentElement: HTMLElement, childElement: HTMLElement): Promise<void> {
    parentElement.removeChild(childElement);
    return Promise.resolve();
  }

  shouldDeferToRouter(_elementOrComponentToMount: any): Promise<boolean> {
    return Promise.resolve(false);
  }

  routeToUrl(_elementOrComponentToMount: any): Promise<any> {
    return Promise.resolve('todo');
  }
}
