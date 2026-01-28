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

  it('should re-emit wheel ionScrollStart/ionScrollEnd from inner columns', async () => {
    const page = await newSpecPage({
      components: [Datetime],
      html: '<ion-datetime prefer-wheel="true" presentation="date"></ion-datetime>',
    });

    await page.waitForChanges();

    const datetime = page.body.querySelector<HTMLIonDatetimeElement>('ion-datetime')!;

    // Attach listeners on the host (events do not bubble)
    const startSpy = jest.fn();
    const endSpy = jest.fn();
    datetime.addEventListener('ionScrollStart', startSpy);
    datetime.addEventListener('ionScrollEnd', endSpy);

    // Simulate a wheel scroll on a single column
    const col = datetime.shadowRoot!.querySelector('ion-picker-column') as HTMLElement | null;
    expect(col).not.toBeNull();

    // Dispatch a start from the inner column (captured and re-emitted by datetime)
    col!.dispatchEvent(new CustomEvent('ionScrollStart', { bubbles: true, composed: true }));
    await page.waitForChanges();
    expect(startSpy).toHaveBeenCalledTimes(1);

    // Dispatch the end — datetime coalesces ends with a short timeout
    col!.dispatchEvent(new CustomEvent('ionScrollEnd', { bubbles: true, composed: true }));
    await new Promise((r) => setTimeout(r, 350));
    await page.waitForChanges();
    expect(endSpy).toHaveBeenCalledTimes(1);
  });

  it('should emit a single start and a single end across multiple columns', async () => {
    const page = await newSpecPage({
      components: [Datetime],
      html: '<ion-datetime prefer-wheel="true" presentation="date"></ion-datetime>',
    });

    await page.waitForChanges();

    const datetime = page.body.querySelector<HTMLIonDatetimeElement>('ion-datetime')!;
    const startSpy = jest.fn();
    const endSpy = jest.fn();
    datetime.addEventListener('ionScrollStart', startSpy);
    datetime.addEventListener('ionScrollEnd', endSpy);

    const cols = Array.from(datetime.shadowRoot!.querySelectorAll('ion-picker-column')) as HTMLElement[];
    // Expect at least 2 columns for month/day/year
    expect(cols.length).toBeGreaterThanOrEqual(2);

    // Starts on two different columns should coalesce into a single datetime ionScrollStart
    cols[0].dispatchEvent(new CustomEvent('ionScrollStart', { bubbles: true, composed: true }));
    cols[1].dispatchEvent(new CustomEvent('ionScrollStart', { bubbles: true, composed: true }));
    await page.waitForChanges();
    expect(startSpy).toHaveBeenCalledTimes(1);

    // End on first column should not emit overall end yet
    cols[0].dispatchEvent(new CustomEvent('ionScrollEnd', { bubbles: true, composed: true }));
    await new Promise((r) => setTimeout(r, 350));
    await page.waitForChanges();
    expect(endSpy).toHaveBeenCalledTimes(0);

    // End on second column should now emit the coalesced end
    cols[1].dispatchEvent(new CustomEvent('ionScrollEnd', { bubbles: true, composed: true }));
    await new Promise((r) => setTimeout(r, 350));
    await page.waitForChanges();
    expect(endSpy).toHaveBeenCalledTimes(1);
  });
});
