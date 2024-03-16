import { newSpecPage } from '@stencil/core/testing';

import { Datetime } from '../../datetime';

describe('datetime: preferWheel', () => {
  beforeEach(() => {
    const mockIntersectionObserver = jest.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null,
    });
    global.IntersectionObserver = mockIntersectionObserver;
  });

  it('should select the working day when clicking the confirm button', async () => {
    const page = await newSpecPage({
      components: [Datetime],
      html: '<ion-datetime prefer-wheel="true" max="2021" show-default-buttons="true"></ion-datetime>',
    });

    const datetime = page.body.querySelector<HTMLIonDatetimeElement>('ion-datetime')!;
    const confirmButton = datetime.shadowRoot!.querySelector<HTMLIonButtonElement>('#confirm-button')!;

    confirmButton.click();

    await page.waitForChanges();

    expect(datetime.value).toBe('2021-12-31T23:59:00');
  });
});
