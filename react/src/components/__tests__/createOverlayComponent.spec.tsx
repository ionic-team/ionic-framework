import React from 'react';
// import { render } from 'react-testing-library';
import { render } from 'react-testing-library';
// import * as utils from '../utils';
// import { createControllerUtils } from '../utils/controller-test-utils';
import 'jest-dom/extend-expect';
import { IonActionSheet } from '../IonActionSheet';
import { defineCustomElements } from '@ionic/core/loader';


describe.skip('createOverlayComponent - events', () => {
  it('skip', () => {});
  // const { cleanupAfterController, createControllerElement, augmentController} = createControllerUtils('ion-action-sheet');

  // beforeEach((done) => {
  //    defineCustomElements(window);
  //     setTimeout(done, 10000)
  // })

  // afterEach(cleanupAfterController);

  // test('should set events on handler', async () => {
  //   const onDismiss = jest.fn();
  //   const { container,   } = render(
  //     <>
  //       <IonActionSheet
  //         isOpen={true}
  //         onDidDismiss={onDismiss}
  //         buttons={[]}
  //       >
  //         ButtonNameA
  //       </IonActionSheet>
  //       <span>ButtonNameA</span>
  //     </>
  //   );
  //   console.log(container.outerHTML)
  //   expect(container).toContainHTML('<div><span>ButtonNameA</span></div>');
  //   // expect(baseElement.querySelector('ion-action-sheet-controller')).toBeInTheDocument();
  // });

  // test('should create component and attach props on opening', async () => {
  //   const onDidDismiss = jest.fn();
  //   const { baseElement, rerender, container } = render(
  //     <IonActionSheet
  //       isOpen={false}
  //       onDidDismiss={onDidDismiss}
  //       buttons={[]}
  //     >
  //       ButtonNameA
  //     </IonActionSheet>
  //   );

  //   const [element, presentFunction] = createControllerElement();
  //   const actionSheetController = augmentController(baseElement, container, element);

  //   const attachEventPropsSpy = jest.spyOn(utils, "attachEventProps");

  //   rerender(
  //     <IonActionSheet
  //       isOpen={true}
  //       onDidDismiss={onDidDismiss}
  //       buttons={[]}
  //     >
  //       ButtonNameA
  //     </IonActionSheet>
  //   );

  //   await waitForElement(() => container.querySelector('ion-action-sheet'));

  //   expect((actionSheetController as any).create).toHaveBeenCalled();
  //   expect(presentFunction).toHaveBeenCalled();
  //   expect(attachEventPropsSpy).toHaveBeenCalledWith(element, {
  //     buttons: [],
  //     onIonActionSheetDidDismiss: onDidDismiss
  //   }, expect.any(Object));
  // });

  // test('should dismiss component on hiding', async () => {
  //   // const [element, , dismissFunction] = createControllerElement();
  //   const dismissFunction = jest.fn();
  //   const { baseElement, rerender } = render(
  //     <IonActionSheet
  //       isOpen={false}
  //       onDidDismiss={() => console.log('FUUUCKKCKC')}
  //       buttons={[]}
  //     >
  //       ButtonNameA
  //     </IonActionSheet>
  //   );

  //   console.log(baseElement.outerHTML)

  //   // augmentController(baseElement, container, element);

  //   rerender(
  //     <IonActionSheet
  //       isOpen={true}
  //       onDidDismiss={() => console.log('FUUUCKKCKC')}
  //       buttons={[]}
  //     >
  //       ButtonNameA
  //     </IonActionSheet>
  //   );

  //   // rerender(
  //   //   <IonActionSheet
  //   //     isOpen={false}
  //   //     onDidDismiss={() => console.log('FUUUCKKCKC')}
  //   //     buttons={[]}
  //   //   >
  //   //     ButtonNameA
  //   //   </IonActionSheet>
  //   // );

  //   console.log(baseElement.outerHTML)

  //   // await waitForElement(() => container.querySelector('ion-action-sheet'));

  //   // rerender(
  //   //   <IonActionSheet
  //   //     isOpen={false}
  //   //     onDidDismiss={jest.fn()}
  //   //     buttons={[]}
  //   //   >
  //   //     ButtonNameA
  //   //   </IonActionSheet>
  //   // );

  //   expect(dismissFunction).toHaveBeenCalled();
  // });
});
