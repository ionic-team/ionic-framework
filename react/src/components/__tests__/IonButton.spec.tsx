import React from 'react';
import { render, fireEvent, cleanup } from 'react-testing-library';
import { IonButton } from '../index';
import { defineCustomElements } from '@ionic/core/loader';

describe('IonButton', () => {

  beforeAll(async (done) => {
    await defineCustomElements(window);
    done();
  })

  afterEach(cleanup);

  it('should render a button', () => {
    const { baseElement, getByText, } = render(<IonButton>my button</IonButton>);
    const button = getByText('my button');
    expect(button).toBeDefined();
  });

  it('when the button is clicked, it should call the click handler', () => {
    const clickSpy = jest.fn();
    const { getByText, } = render(<IonButton onClick={clickSpy}>my button</IonButton>);
    const button = getByText('my button');
    fireEvent.click(button);
    expect(clickSpy).toHaveBeenCalled();
  });
});
