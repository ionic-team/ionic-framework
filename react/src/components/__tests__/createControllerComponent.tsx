import React from 'react';
import { Components } from '@ionic/core';
import { createControllerComponent } from '../createControllerComponent';
import { render, cleanup, waitForElement } from 'react-testing-library';

afterEach(cleanup);

describe('createComponent - events', () => {
  type LoadingOptions = Components.IonLoadingAttributes;
  const IonLoading = createControllerComponent<LoadingOptions, HTMLIonLoadingElement, HTMLIonLoadingControllerElement>('ion-loading', 'ion-loading-controller')

  test('should set events on handler', () => {
    const { baseElement } = render(
      <IonLoading isOpen={false}>
        ButtonNameA
      </IonLoading>
    );

    expect(baseElement.children[1].tagName).toEqual('ION-LOADING-CONTROLLER');
  });
  test('should set events on handler', async () => {
    const { baseElement, rerender } = render(
      <IonLoading
        isOpen={true}
        duration={2000}
      >
        ButtonNameA
      </IonLoading>
    );

    rerender(
      <IonLoading
        isOpen={false}
        duration={2000}
      >
        ButtonNameA
      </IonLoading>
    );

    const element = await waitForElement(() => baseElement.querySelector('ion-loading'));

    expect(element.tagName).toEqual('ION-LOADING');

  });
});
