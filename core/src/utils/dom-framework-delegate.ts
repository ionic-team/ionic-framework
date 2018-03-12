
export interface FrameworkDelegate {
  attachViewToDom(elementOrContainerToMountTo: any, elementOrComponentToMount: any, propsOrDataObj?: any, classesToAdd?: string[], escapeHatch?: any): Promise<FrameworkMountingData>;
  removeViewFromDom(elementOrContainerToUnmountFrom: any, elementOrComponentToUnmount: any, escapeHatch?: any): Promise<void>;
}


export interface FrameworkMountingData {
  element: HTMLElement;
  component: any;
  data: any;
}

export class DomFrameworkDelegate implements FrameworkDelegate {

  attachViewToDom(parentElement: HTMLElement, tagOrElement: string | HTMLElement, data: any = {}, classesToAdd: string[] = []): Promise<FrameworkMountingData> {
    return new Promise((resolve) => {
      const usersElement = (typeof tagOrElement === 'string' ? document.createElement(tagOrElement) : tagOrElement);
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
}
