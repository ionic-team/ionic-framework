import React from 'react';
import { JSX } from '@ionic/core';
import { createReactComponent } from '../createComponent';
import { render, fireEvent, cleanup, RenderResult } from 'react-testing-library';
import { IonButton } from '../index';

afterEach(cleanup);

describe('createComponent - events', () => {
  test('should set events on handler', () => {
    const FakeOnClick = jest.fn((e) => e);
    const IonButton = createReactComponent<JSX.IonButton, HTMLIonButtonElement>('ion-button');

    const { getByText } = render(
      <IonButton onClick={FakeOnClick}>
        ButtonNameA
      </IonButton>
    );
    fireEvent.click(getByText('ButtonNameA'));
    expect(FakeOnClick).toBeCalledTimes(1);
  });

  test('should add custom events', () => {
    const FakeIonFocus = jest.fn((e) => e);
    const IonInput = createReactComponent<JSX.IonInput, HTMLIonInputElement>('ion-input');

    const { getByText } = render(
      <IonInput onIonFocus={FakeIonFocus}>
        ButtonNameA
      </IonInput>
    );
    const ionInputItem = getByText('ButtonNameA');
    expect(Object.keys((ionInputItem as any).__events)).toEqual(['ionFocus']);
  });
});

describe('createComponent - ref', () => {
  test('should pass ref on to web component instance', () => {
    const ionButtonRef: React.RefObject<any> = React.createRef();
    const IonButton = createReactComponent<JSX.IonButton, HTMLIonButtonElement>('ion-button');

    const { getByText } = render(
      <IonButton ref={ionButtonRef}>
        ButtonNameA
      </IonButton>
    )
    const ionButtonItem = getByText('ButtonNameA');
    expect(ionButtonRef.current).toEqual(ionButtonItem);
  });
});

describe('when working with css classes', () => {
  const myClass = 'my-class'
  const myClass2 = 'my-class2'
  const customClass = 'custom-class';

  describe('when a class is added to className', () => {
    let renderResult: RenderResult;
    let button: HTMLElement;

    beforeEach(() => {
      renderResult = render(
        <IonButton className={myClass}>
          Hello!
        </IonButton>
      );
      button = renderResult.getByText(/Hello/);
    });

    it('then it should be in the class list', () => {
      expect(button.classList.contains(myClass)).toBeTruthy();
    });

    it('when a class is added to class list outside of React, then that class should still be in class list when rendered again', () => {
      button.classList.add(customClass);
      expect(button.classList.contains(customClass)).toBeTruthy();
      renderResult.rerender(
        <IonButton className={myClass}>
          Hello!
        </IonButton>
      );
      expect(button.classList.contains(customClass)).toBeTruthy();
    });
  });

  describe('when multiple classes are added to className', () => {
    let renderResult: RenderResult;
    let button: HTMLElement;

    beforeEach(() => {
      renderResult = render(
        <IonButton className={myClass + ' ' + myClass2}>
          Hello!
        </IonButton>
      );
      button = renderResult.getByText(/Hello/);
    });

    it('then both classes should be in class list', () => {
      expect(button.classList.contains(myClass)).toBeTruthy();
      expect(button.classList.contains(myClass2)).toBeTruthy();
    });

    it('when one of the classes is removed, then only the remaining class should be in class list', () => {
      expect(button.classList.contains(myClass)).toBeTruthy();
      expect(button.classList.contains(myClass2)).toBeTruthy();

      renderResult.rerender(
        <IonButton className={myClass}>
          Hello!
        </IonButton>
      );

      expect(button.classList.contains(myClass)).toBeTruthy();
      expect(button.classList.contains(myClass2)).toBeFalsy();
    });

    it('when a custom class is added outside of React and one of the classes is removed, then only the remaining class and the custom class should be in class list', () => {
      button.classList.add(customClass);
      expect(button.classList.contains(myClass)).toBeTruthy();
      expect(button.classList.contains(myClass2)).toBeTruthy();
      expect(button.classList.contains(customClass)).toBeTruthy();

      renderResult.rerender(
        <IonButton className={myClass}>
          Hello!
        </IonButton>
      );

      expect(button.classList.contains(myClass)).toBeTruthy();
      expect(button.classList.contains(myClass)).toBeTruthy();
      expect(button.classList.contains(myClass2)).toBeFalsy();
    });
  })
});
