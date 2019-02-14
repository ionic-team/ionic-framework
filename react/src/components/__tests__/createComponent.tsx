import React from 'react';
import { Components } from '@ionic/core'
import { createReactComponent } from '../createComponent';
import { render, fireEvent, cleanup } from 'react-testing-library';

afterEach(cleanup);

describe('createComponent - events', () => {
  test('should set events on handler', () => {
    const FakeOnClick = jest.fn((e) => e);
    const IonButton = createReactComponent<Components.IonButtonAttributes, HTMLIonButtonElement>('ion-button');

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
    const IonInput = createReactComponent<Components.IonInputAttributes, HTMLIonInputElement>('ion-input');

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
    const IonButton = createReactComponent<Components.IonButtonAttributes, HTMLIonButtonElement>('ion-button');

    const { getByText } = render(
      <IonButton ref={ionButtonRef}>
        ButtonNameA
      </IonButton>
    )
    const ionButtonItem = getByText('ButtonNameA');
    expect(ionButtonRef.current).toEqual(ionButtonItem);
  });
});
