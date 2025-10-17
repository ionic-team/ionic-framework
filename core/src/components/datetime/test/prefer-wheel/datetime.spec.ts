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

  it('should enter and exit input mode programmatically and emit events', async () => {
    const page = await newSpecPage({
      components: [Datetime],
      html: '<ion-datetime prefer-wheel="true"></ion-datetime>',
    });
    const datetime = page.rootInstance as Datetime;
    const spy = jest.fn();
    page.root?.addEventListener('inputModeChanged', spy);

    // Enter input mode (emit active once)
    await datetime.enterInputMode('all', { focus: true });
    await page.waitForChanges();
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ detail: expect.objectContaining({ active: true }) }));

    // Exit input mode (emit inactive once)
    await datetime.exitInputMode();
    await page.waitForChanges();
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ detail: expect.objectContaining({ active: false }) }));

    // Exactly two emissions total (active then inactive)
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('should not emit on repeated enterInputMode calls without state change', async () => {
    const page = await newSpecPage({
      components: [Datetime],
      html: '<ion-datetime prefer-wheel="true"></ion-datetime>',
    });
    const datetime = page.rootInstance as Datetime;
    const spy = jest.fn();
    page.root?.addEventListener('inputModeChanged', spy);

    // First enter should emit active
    await datetime.enterInputMode('all', { focus: true });
    await page.waitForChanges();
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ detail: expect.objectContaining({ active: true }) }));

    // Clear and enter again without changing scope/column should not emit again
    spy.mockClear();
    await datetime.enterInputMode('all', { focus: true });
    await page.waitForChanges();
    expect(spy).not.toHaveBeenCalled();

    // Clean up by exiting to avoid affecting other tests
    await datetime.exitInputMode();
    await page.waitForChanges();
  });

  it('should not emit when presentation does not support numeric input', async () => {
    const page = await newSpecPage({
      components: [Datetime],
      html: '<ion-datetime prefer-wheel="true" presentation="date"></ion-datetime>',
    });
    const datetime = page.rootInstance as Datetime;
    const spy = jest.fn();
    page.root?.addEventListener('inputModeChanged', spy);

    // Entering input mode should no-op and not emit
    await datetime.enterInputMode('all', { focus: true });
    await page.waitForChanges();
    expect(spy).not.toHaveBeenCalled();

    // Exiting input mode should also no-op and not emit
    await datetime.exitInputMode();
    await page.waitForChanges();
    expect(spy).not.toHaveBeenCalled();
  });
});
