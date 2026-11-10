import { newSpecPage } from '@stencil/core/testing';

import { config } from '../../../../global/config';
import { Button } from '../../../button/button';
import { Datetime } from '../../datetime';

describe('datetime: buttons', () => {
  beforeEach(() => {
    const mockIntersectionObserver = jest.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null,
    });
    global.IntersectionObserver = mockIntersectionObserver;
  });

  afterEach(() => {
    config.reset({});
  });

  it('should keep the bold hue when the theme config sets another hue', async () => {
    config.reset({ customTheme: { config: { components: { IonButton: { hue: 'subtle' } } } } });

    const page = await newSpecPage({
      components: [Datetime, Button],
      html: `<ion-datetime show-default-buttons="true" show-clear-button="true"></ion-datetime>`,
    });

    const datetime = page.body.querySelector('ion-datetime')!;
    const buttons = Array.from(datetime.shadowRoot!.querySelectorAll('ion-button'));

    expect(buttons.map((button) => button.classList.contains('button-hue-bold'))).toEqual([
      true,
      true,
      true,
      true,
      true,
    ]);
  });
});
