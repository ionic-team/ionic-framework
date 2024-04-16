import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';

import { PickerColumn } from '../picker-column';

describe('picker-column: assistive element', () => {
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
    const assistiveFocusable = pickerCol.shadowRoot!.querySelector('.assistive-focusable')!;

    expect(assistiveFocusable.getAttribute('aria-label')).not.toBe(null);
  });

  it('should have a custom label', async () => {
    const page = await newSpecPage({
      components: [PickerColumn],
      template: () => <ion-picker-column aria-label="my label"></ion-picker-column>,
    });

    const pickerCol = page.body.querySelector('ion-picker-column')!;
    const assistiveFocusable = pickerCol.shadowRoot!.querySelector('.assistive-focusable')!;

    expect(assistiveFocusable.getAttribute('aria-label')).toBe('my label');
  });

  it('should update a custom label', async () => {
    const page = await newSpecPage({
      components: [PickerColumn],
      template: () => <ion-picker-column></ion-picker-column>,
    });

    const pickerCol = page.body.querySelector('ion-picker-column')!;
    const assistiveFocusable = pickerCol.shadowRoot!.querySelector('.assistive-focusable')!;

    pickerCol.setAttribute('aria-label', 'my label');
    await page.waitForChanges();

    expect(assistiveFocusable.getAttribute('aria-label')).toBe('my label');
  });

  it('should receive keyboard focus when enabled', async () => {
    const page = await newSpecPage({
      components: [PickerColumn],
      template: () => <ion-picker-column></ion-picker-column>,
    });

    const pickerCol = page.body.querySelector('ion-picker-column')!;
    const assistiveFocusable = pickerCol.shadowRoot!.querySelector<HTMLElement>('.assistive-focusable')!;

    expect(assistiveFocusable.tabIndex).toBe(0);
  });

  it('should not receive keyboard focus when disabled', async () => {
    const page = await newSpecPage({
      components: [PickerColumn],
      template: () => <ion-picker-column disabled={true}></ion-picker-column>,
    });

    const pickerCol = page.body.querySelector('ion-picker-column')!;
    const assistiveFocusable = pickerCol.shadowRoot!.querySelector<HTMLElement>('.assistive-focusable')!;

    expect(assistiveFocusable.tabIndex).toBe(-1);
  });
});
