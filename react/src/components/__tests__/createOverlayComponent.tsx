import React from 'react';
import { Components } from '@ionic/core'
import { createOverlayComponent } from '../createOverlayComponent';
import { render, cleanup, waitForElement } from 'react-testing-library';
import * as utils from '../utils';
import 'jest-dom/extend-expect';

afterEach(cleanup);

function createControllerElement(tagName: string): [HTMLElement, jest.Mock, jest.Mock] {
  const element = document.createElement(tagName);
  const presentFunction = jest.fn(() => Promise.resolve(true));
  const dismissFunction = jest.fn(() => Promise.resolve(true));
  (element as any).present = presentFunction;
  (element as any).dismiss = dismissFunction;

  return [element, presentFunction, dismissFunction];
}

describe('createComponent - events', () => {
  type ActionSheetOptions = Components.IonActionSheetAttributes;
  const IonActionSheet = createOverlayComponent<ActionSheetOptions, HTMLIonActionSheetElement, HTMLIonActionSheetControllerElement>('ion-action-sheet', 'ion-action-sheet-controller');

  test('should set events on handler', async () => {
    const onDismiss = jest.fn();
    const { baseElement } = render(
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

    expect(baseElement).toContainHTML('<div><span>ButtonNameA</span></div><ion-action-sheet-controller></ion-action-sheet-controller>');
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

    const attachEventPropsSpy = jest.spyOn(utils, "attachEventProps");

    (actionSheetController as any).create = jest.fn(() => {
      baseElement.append(element);
      return Promise.resolve(element);
    });

    rerender(
      <IonActionSheet
        isOpen={true}
        onDidDismiss={onDidDismiss}
        buttons={[]}
      >
        ButtonNameA
      </IonActionSheet>
    );

    await waitForElement(() => baseElement.querySelector('ion-action-sheet'), { container });

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

    const actionSheetController = baseElement.querySelector('ion-action-sheet-controller');

    (actionSheetController as any).create = jest.fn(() => {
      baseElement.append(element);
      return Promise.resolve(element);
    });

    rerender(
      <IonActionSheet
        isOpen={true}
        onDidDismiss={jest.fn()}
        buttons={[]}
      >
        ButtonNameA
      </IonActionSheet>
    );

    await waitForElement(() => baseElement.querySelector('ion-action-sheet'), { container });

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
