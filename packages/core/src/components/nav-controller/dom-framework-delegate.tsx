import { FrameworkDelegate, FrameworkMountingData, } from '../../index';
import { isString } from '../../utils/helpers';

export class DomFrameworkDelegate implements FrameworkDelegate {
  attachViewToDom(parentElement: HTMLElement, tagOrElement: string | HTMLElement, classesToAdd: string[] = []): Promise<FrameworkMountingData> {

    return new Promise((resolve) => {
      const usersElement = (isString(tagOrElement) ? document.createElement(tagOrElement) : tagOrElement) as HTMLElement;
      if (classesToAdd.length) {
        for (const clazz of classesToAdd) {
          usersElement.classList.add(clazz);
        }
      }
      parentElement.appendChild(usersElement);
      resolve({
        element: usersElement
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
