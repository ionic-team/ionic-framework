import React from 'react';
import { Components } from '@ionic/core'
import { createOverlayComponent } from '../createOverlayComponent';
import { render, cleanup, waitForElement } from 'react-testing-library';
import * as utils from '../utils';
import 'jest-dom/extend-expect';

function cleanupAfterController(tagName: string) {
  const controller = document.querySelector(`${tagName}-controller`);
  if (controller) {
    controller.remove();
  }
  const element = document.querySelector(tagName);
  if (element) {
    element.remove();
  }
  cleanup();
}

function createControllerElement(tagName: string): [HTMLElement, jest.Mock, jest.Mock] {
  const element = document.createElement(tagName);
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

function augmentController(tagName: string, baseElement: HTMLElement, container: HTMLElement, childElement: HTMLElement): HTMLElement {
  const controller: HTMLElement = baseElement.querySelector(`${tagName}-controller`);
  (controller as any).componentOnReady = jest.fn(async () => {
    return true;
  });
  (controller as any).create = jest.fn(async () => {
    container.append(childElement);
    return childElement;
  });

  return controller;
}

describe('createComponent - events', () => {
  type ActionSheetOptions = Components.IonActionSheetAttributes;
  const IonActionSheet = createOverlayComponent<ActionSheetOptions, HTMLIonActionSheetElement, HTMLIonActionSheetControllerElement>('ion-action-sheet', 'ion-action-sheet-controller');
  afterEach(() => cleanupAfterController('ion-action-sheet'));

  test('should set events on handler', async () => {
    const onDismiss = jest.fn();
    const { baseElement, container } = render(
      <>
        <IonActionSheet
          isOpen={false}
          onDidDismiss={onDismiss}
          buttons={[]}
        >
          ButtonNameA
        </IonActionSheet>
        <span>ButtonNameA</span>
      </>
    );
    expect(container).toContainHTML('<div><span>ButtonNameA</span></div>');
    expect(baseElement.querySelector('ion-action-sheet-controller')).toBeInTheDocument();
  });

  test('should create component and attach props on opening', async () => {
    const onDidDismiss = jest.fn();
    const { baseElement, rerender, container } = render(
      <IonActionSheet
        isOpen={false}
        onDidDismiss={onDidDismiss}
        buttons={[]}
      >
        ButtonNameA
      </IonActionSheet>
    );

    const actionSheetController = baseElement.querySelector('ion-action-sheet-controller');
    const [element, presentFunction] = createControllerElement('ion-action-sheet');
    augmentController('ion-action-sheet', baseElement, container, element);

    const attachEventPropsSpy = jest.spyOn(utils, "attachEventProps");

    rerender(
      <IonActionSheet
        isOpen={true}
        onDidDismiss={onDidDismiss}
        buttons={[]}
      >
        ButtonNameA
      </IonActionSheet>
    );

    await waitForElement(() => container.querySelector('ion-action-sheet'));

    expect((actionSheetController as any).create).toHaveBeenCalled();
    expect(presentFunction).toHaveBeenCalled();
    expect(attachEventPropsSpy).toHaveBeenCalledWith(element, {
      buttons: [],
      onIonActionSheetDidDismiss: onDidDismiss
    });
  });

  test('should dismiss component on hiding', async () => {
    const [element, , dismissFunction] = createControllerElement('ion-action-sheet');

    const { baseElement, rerender, container } = render(
      <IonActionSheet
        isOpen={false}
        onDidDismiss={jest.fn()}
        buttons={[]}
      >
        ButtonNameA
      </IonActionSheet>
    );

    augmentController('ion-action-sheet', baseElement, container, element);

    rerender(
      <IonActionSheet
        isOpen={true}
        onDidDismiss={jest.fn()}
        buttons={[]}
      >
        ButtonNameA
      </IonActionSheet>
    );

    await waitForElement(() => container.querySelector('ion-action-sheet'));

    rerender(
      <IonActionSheet
        isOpen={false}
        onDidDismiss={jest.fn()}
        buttons={[]}
      >
        ButtonNameA
      </IonActionSheet>
    );

    expect(dismissFunction).toHaveBeenCalled();
  });
});
