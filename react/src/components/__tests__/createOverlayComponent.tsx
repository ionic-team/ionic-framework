import React from 'react';
import { Components } from '@ionic/core'
import { createOverlayComponent } from '../createOverlayComponent';
import { render, waitForElement } from 'react-testing-library';
import * as utils from '../utils';
import { createControllerUtils } from '../utils/controller-test-utils';
import 'jest-dom/extend-expect';

describe('createOverlayComponent - events', () => {
  const { cleanupAfterController, createControllerElement, augmentController} = createControllerUtils('ion-action-sheet');
  type ActionSheetOptions = Components.IonActionSheetAttributes;
  const IonActionSheet = createOverlayComponent<ActionSheetOptions, HTMLIonActionSheetElement, HTMLIonActionSheetControllerElement>('ion-action-sheet', 'ion-action-sheet-controller');

  afterEach(cleanupAfterController);

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

    const [element, presentFunction] = createControllerElement();
    const actionSheetController = augmentController(baseElement, container, element);

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
    const [element, , dismissFunction] = createControllerElement();

    const { baseElement, rerender, container } = render(
      <IonActionSheet
        isOpen={false}
        onDidDismiss={jest.fn()}
        buttons={[]}
      >
        ButtonNameA
      </IonActionSheet>
    );

    augmentController(baseElement, container, element);

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
