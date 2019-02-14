import React from 'react';
import { Components } from '@ionic/core'
import { createOverlayComponent } from '../createOverlayComponent';
import { render, cleanup } from 'react-testing-library';

afterEach(cleanup);

describe('createComponent - events', () => {
  type ActionSheetOptions = Components.IonActionSheetAttributes;
  const IonActionSheet = createOverlayComponent<ActionSheetOptions, HTMLIonActionSheetElement, HTMLIonActionSheetControllerElement>('ion-action-sheet', 'ion-action-sheet-controller');

  test('should set events on handler', () => {
    const { baseElement } = render(
      <IonActionSheet
        isOpen={false}
        buttons={[]}
      >
        ButtonNameA
      </IonActionSheet>
    );

    expect(baseElement.children[1].tagName).toEqual('ION-ACTION-SHEET-CONTROLLER');
  });
});
