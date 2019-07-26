import React from 'react';
import { render, waitForElement, wait } from 'react-testing-library';
import * as utils from '../utils';
import { createControllerUtils } from '../utils/controller-test-utils';
import 'jest-dom/extend-expect';
import {IonLoading} from '../IonLoading';

describe.skip('createControllerComponent - events', () => {
  it('skip', () => {});
  // const { cleanupAfterController, createControllerElement, augmentController } = createControllerUtils('ion-loading');

  // afterEach(cleanupAfterController);

  // test('should create controller component outside of the react component', async () => {
  //   const { container, baseElement } = render(
  //     <>
  //       <IonLoading
  //         isOpen={false}
  //         onDidDismiss={jest.fn()}
  //         duration={2000}
  //       >
  //       </IonLoading>
  //       <span>ButtonNameA</span>
  //     </>
  //   );
  //   expect(container).toContainHTML('<div><span>ButtonNameA</span></div>');
  //   expect(baseElement.querySelector('ion-loading-controller')).toBeInTheDocument();
  // });

  // test('should create component and attach props on opening', async () => {
  //   const onDidDismiss = jest.fn();
  //   const { baseElement, container, rerender } = render(
  //     <IonLoading
  //       isOpen={false}
  //       onDidDismiss={onDidDismiss}
  //       duration={2000}
  //     >
  //       ButtonNameA
  //     </IonLoading>
  //   );

  //   const [element, presentFunction] = createControllerElement();
  //   const loadingController = augmentController(baseElement, container, element);

  //   const attachEventPropsSpy = jest.spyOn(utils, "attachEventProps");

  //   rerender(
  //     <IonLoading
  //       isOpen={true}
  //       onDidDismiss={onDidDismiss}
  //       duration={2000}
  //     >
  //       ButtonNameA
  //     </IonLoading>
  //   );

  //   await waitForElement(() => container.querySelector('ion-loading'));

  //   expect((loadingController as any).create).toHaveBeenCalledWith({
  //     duration: 2000,
  //     children: 'ButtonNameA',
  //     onIonLoadingDidDismiss: onDidDismiss
  //   });
  //   expect(presentFunction).toHaveBeenCalled();
  //   expect(attachEventPropsSpy).toHaveBeenCalledWith(element, {
  //     duration: 2000,
  //     children: 'ButtonNameA',
  //     onIonLoadingDidDismiss: onDidDismiss
  //   }, undefined);
  // });

  // test('should dismiss component on hiding', async () => {
  //   const { container, baseElement, rerender } = render(
  //     <IonLoading
  //       isOpen={false}
  //       onDidDismiss={jest.fn()}
  //       duration={2000}
  //     >
  //       ButtonNameA
  //     </IonLoading>
  //   );

  //   const [element, , dismissFunction] = createControllerElement();
  //   augmentController(baseElement, container, element);

  //   rerender(
  //     <IonLoading
  //       isOpen={true}
  //       onDidDismiss={jest.fn()}
  //       duration={2000}
  //     >
  //       ButtonNameA
  //     </IonLoading>
  //   );

  //   await waitForElement(() => container.querySelector('ion-loading'));

  //   rerender(
  //     <IonLoading
  //       isOpen={false}
  //       onDidDismiss={jest.fn()}
  //       duration={2000}
  //     >
  //       ButtonNameA
  //     </IonLoading>
  //   );

  //   await wait(() => {
  //     const item = container.querySelector('ion-loading');
  //     if (item) {
  //       throw new Error();
  //     }
  //   });

  //   expect(dismissFunction).toHaveBeenCalled();
  // });

  // test('should present component if isOpen is initially true', async () => {
  //   const [element] = createControllerElement();
  //   const container = document.createElement('div');
  //   const baseElement = document.createElement('div');

  //   augmentController(baseElement, container, element);

  //   const { } = render(
  //     <IonLoading
  //       isOpen={true}
  //       onDidDismiss={jest.fn()}
  //       duration={12000}
  //     >
  //       Loading...
  //     </IonLoading>, {
  //       container: document.body.appendChild(container),
  //       baseElement: baseElement
  //     }
  //   );

  //   await waitForElement(() => document.querySelector('ion-loading'));

  //   const item = document.querySelector('ion-loading');
  //   expect(item).toBeTruthy();
  // });

});
