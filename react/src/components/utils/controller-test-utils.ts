import { cleanup } from 'react-testing-library';

export function createControllerUtils(tagName: string) {
  const elementTag = tagName;
  const controllerTag = `${tagName}-controller`;

  function cleanupAfterController() {
    const controller = document.querySelector(controllerTag);
    if (controller) {
      controller.remove();
    }
    const element = document.querySelector(elementTag);
    if (element) {
      element.remove();
    }
    cleanup();
  }

  function createControllerElement(): [HTMLElement, jest.Mock, jest.Mock] {
    const element = document.createElement(elementTag);
    const presentFunction = jest.fn(() => {
      element.setAttribute('active', 'true');
      return Promise.resolve(true)
    });
    const dismissFunction = jest.fn(() => {
      element.remove();
      Promise.resolve(true)
    });
    (element as any).present = presentFunction;
    (element as any).dismiss = dismissFunction;

    return [element, presentFunction, dismissFunction];
  }

  function augmentController(baseElement: HTMLElement, container: HTMLElement, childElement: HTMLElement): HTMLElement {
    let controller: HTMLElement = baseElement.querySelector(controllerTag);
    if(!controller) {
      controller = document.createElement(controllerTag);
      document.body.appendChild(controller);
    }
    (controller as any).componentOnReady = jest.fn(async () => {
      return true;
    });
    (controller as any).create = jest.fn(async () => {
      container.append(childElement);
      return childElement;
    });

    return controller;
  }

  return {
    cleanupAfterController,
    createControllerElement,
    augmentController
  };
}
