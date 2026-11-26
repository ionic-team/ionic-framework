import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { doc } from '@utils/browser';

import { PickerColumnOption } from '../../picker-column-option/picker-column-option';
import { PickerColumn } from '../picker-column';

describe('picker-column', () => {
  beforeEach(() => {
    const mockIntersectionObserver = jest.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null,
    });
    global.IntersectionObserver = mockIntersectionObserver;
  });

  it('should have a default label', async () => {
    const page = await newSpecPage({
      components: [PickerColumn],
      template: () => <ion-picker-column></ion-picker-column>,
    });

    const pickerCol = page.body.querySelector('ion-picker-column')!;
    const pickerOpts = pickerCol.shadowRoot!.querySelector('.picker-opts')!;

    expect(pickerOpts.getAttribute('aria-label')).not.toBe(null);
  });

  it('should have a custom label', async () => {
    const page = await newSpecPage({
      components: [PickerColumn],
      template: () => <ion-picker-column aria-label="my label"></ion-picker-column>,
    });

    const pickerCol = page.body.querySelector('ion-picker-column')!;
    const pickerOpts = pickerCol.shadowRoot!.querySelector('.picker-opts')!;

    expect(pickerOpts.getAttribute('aria-label')).toBe('my label');
  });

  it('should update a custom label', async () => {
    const page = await newSpecPage({
      components: [PickerColumn],
      template: () => <ion-picker-column></ion-picker-column>,
    });

    const pickerCol = page.body.querySelector('ion-picker-column')!;
    const pickerOpts = pickerCol.shadowRoot!.querySelector('.picker-opts')!;

    pickerCol.setAttribute('aria-label', 'my label');
    await page.waitForChanges();

    expect(pickerOpts.getAttribute('aria-label')).toBe('my label');
  });

  it('should receive keyboard focus when enabled', async () => {
    const page = await newSpecPage({
      components: [PickerColumn],
      template: () => <ion-picker-column></ion-picker-column>,
    });

    const pickerCol = page.body.querySelector('ion-picker-column')!;
    const pickerOpts = pickerCol.shadowRoot!.querySelector<HTMLElement>('.picker-opts')!;

    expect(pickerOpts.tabIndex).toBe(0);
  });

  it('should not receive keyboard focus when disabled', async () => {
    const page = await newSpecPage({
      components: [PickerColumn],
      template: () => <ion-picker-column disabled={true}></ion-picker-column>,
    });

    const pickerCol = page.body.querySelector('ion-picker-column')!;
    const pickerOpts = pickerCol.shadowRoot!.querySelector<HTMLElement>('.picker-opts')!;

    expect(pickerOpts.tabIndex).toBe(-1);
  });

  it('should use option aria-label as assistive element aria-valuetext', async () => {
    const page = await newSpecPage({
      components: [PickerColumn, PickerColumnOption],
      template: () => (
        <ion-picker-column value={1}>
          <ion-picker-column-option value={1} aria-label="My Label">
            My Text
          </ion-picker-column-option>
        </ion-picker-column>
      ),
    });

    const pickerCol = page.body.querySelector('ion-picker-column')!;
    const pickerOpts = pickerCol.shadowRoot!.querySelector('.picker-opts')!;

    expect(pickerOpts.getAttribute('aria-valuetext')).toBe('My Label');
  });

  it('should use option text as assistive element aria-valuetext when no label provided', async () => {
    const page = await newSpecPage({
      components: [PickerColumn, PickerColumnOption],
      template: () => (
        <ion-picker-column value={1}>
          <ion-picker-column-option value={1}>My Text</ion-picker-column-option>
        </ion-picker-column>
      ),
    });

    const pickerCol = page.body.querySelector('ion-picker-column')!;
    const pickerOpts = pickerCol.shadowRoot!.querySelector('.picker-opts')!;

    expect(pickerOpts.getAttribute('aria-valuetext')).toBe('My Text');
  });

  it('should focus the scrollable options element when setFocus is called', async () => {
    const page = await newSpecPage({
      components: [PickerColumn],
      template: () => <ion-picker-column></ion-picker-column>,
    });

    const pickerCol = page.body.querySelector('ion-picker-column')!;
    const pickerOpts = pickerCol.shadowRoot!.querySelector<HTMLElement>('.picker-opts')!;
    const focusSpy = jest.spyOn(pickerOpts, 'focus');

    await pickerCol.setFocus();

    expect(focusSpy).toHaveBeenCalledTimes(1);
  });

  it('should update aria-valuetext on the scrollable options element while scrolling', async () => {
    let ioCallback: IntersectionObserverCallback | undefined;
    (global.IntersectionObserver as jest.Mock).mockImplementation((cb: IntersectionObserverCallback) => {
      ioCallback = cb;
      return {
        observe: () => null,
        unobserve: () => null,
        disconnect: () => null,
      };
    });

    const originalElementsFromPoint = doc!.elementsFromPoint;
    const originalRaf = global.requestAnimationFrame;

    const page = await newSpecPage({
      components: [PickerColumn, PickerColumnOption],
      template: () => (
        <ion-picker-column value={1}>
          <ion-picker-column-option value={1}>First</ion-picker-column-option>
          <ion-picker-column-option value={2}>Second</ion-picker-column-option>
        </ion-picker-column>
      ),
    });

    jest.useFakeTimers();
    global.requestAnimationFrame = ((cb: FrameRequestCallback) => setTimeout(cb, 16)) as any;

    try {
      const pickerCol = page.body.querySelector('ion-picker-column')!;
      const pickerOpts = pickerCol.shadowRoot!.querySelector<HTMLElement>('.picker-opts')!;
      pickerOpts.scroll = jest.fn();
      const options = pickerCol.querySelectorAll('ion-picker-column-option');

      let centeredOption: Element = options[0];
      doc!.elementsFromPoint = jest.fn(() => [centeredOption]);

      ioCallback!([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver);
      jest.advanceTimersByTime(20);

      pickerOpts.dispatchEvent(new Event('scroll'));
      jest.advanceTimersByTime(300);

      centeredOption = options[1];
      pickerOpts.dispatchEvent(new Event('scroll'));
      jest.advanceTimersByTime(20);

      expect(pickerCol.value).toBe(1);
      expect(pickerOpts.getAttribute('aria-valuetext')).toBe('Second');
    } finally {
      global.requestAnimationFrame = originalRaf;
      doc!.elementsFromPoint = originalElementsFromPoint;
      jest.useRealTimers();
    }
  });
});
