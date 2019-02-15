import React from 'react';
import { Components } from '@ionic/core';
import { createControllerComponent } from '../createControllerComponent';
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
  type LoadingOptions = Components.IonLoadingAttributes;
  const IonLoading = createControllerComponent<LoadingOptions, HTMLIonLoadingElement, HTMLIonLoadingControllerElement>('ion-loading', 'ion-loading-controller')

  test('should create controller component', async () => {
    const { baseElement } = render(
      <>
        <IonLoading
          isOpen={false}
          onDidDismiss={jest.fn()}
          duration={2000}
        >
        </IonLoading>
        <span>ButtonNameA</span>
      </>
    );
    expect(baseElement).toContainHTML('<div><span>ButtonNameA</span></div><ion-loading-controller></ion-loading-controller>');
  });

  test('should create component and attach props on opening', async () => {
    const onDidDismiss = jest.fn();
    const { baseElement, rerender, container } = render(
      <IonLoading
        isOpen={false}
        onDidDismiss={onDidDismiss}
        duration={2000}
      >
        ButtonNameA
      </IonLoading>
    );

    const loadingController = baseElement.querySelector('ion-loading-controller');
    const [element, presentFunction] = createControllerElement('ion-loading');

    const attachEventPropsSpy = jest.spyOn(utils, "attachEventProps");

    (loadingController as any).create = jest.fn(() => {
      baseElement.append(element);
      return Promise.resolve(element);
    });

    rerender(
      <IonLoading
        isOpen={true}
        onDidDismiss={onDidDismiss}
        duration={2000}
      >
        ButtonNameA
      </IonLoading>
    );

    await waitForElement(() => baseElement.querySelector('ion-loading'), { container });

    expect((loadingController as any).create).toHaveBeenCalledWith({
      duration: 2000,
      children: 'ButtonNameA',
      onIonLoadingDidDismiss: onDidDismiss
    });
    expect(presentFunction).toHaveBeenCalled();
    expect(attachEventPropsSpy).toHaveBeenCalledWith(element, {
      duration: 2000,
      children: 'ButtonNameA',
      onIonLoadingDidDismiss: onDidDismiss
    });
  });

  test('should dismiss component on hiding', async () => {
    const [element, , dismissFunction] = createControllerElement('ion-loading');

    const { baseElement, rerender, container } = render(
      <IonLoading
        isOpen={false}
        onDidDismiss={jest.fn()}
        duration={2000}
      >
        ButtonNameA
      </IonLoading>
    );

    const loadingController = baseElement.querySelector('ion-loading-controller');

    (loadingController as any).create = jest.fn(() => {
      baseElement.append(element);
      return Promise.resolve(element);
    });

    rerender(
      <IonLoading
        isOpen={true}
        onDidDismiss={jest.fn()}
        duration={2000}
      >
        ButtonNameA
      </IonLoading>
    );

    await waitForElement(() => baseElement.querySelector('ion-loading'), { container });

    rerender(
      <IonLoading
        isOpen={false}
        onDidDismiss={jest.fn()}
        duration={2000}
      >
        ButtonNameA
      </IonLoading>
    );

    expect(dismissFunction).toHaveBeenCalled();
  });
});
