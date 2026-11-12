import { newSpecPage } from '@stencil/core/testing';

import { Backdrop } from '../backdrop';

const tap = (el: HTMLElement) => {
  const event = new MouseEvent('click', { bubbles: true, cancelable: true });
  el.dispatchEvent(event);
  return event;
};

describe('backdrop: tap', () => {
  it('should emit ionBackdropTap when tapped', async () => {
    const page = await newSpecPage({
      components: [Backdrop],
      html: `<ion-backdrop></ion-backdrop>`,
    });

    const backdrop = page.body.querySelector('ion-backdrop')!;
    const onTap = jest.fn();
    backdrop.addEventListener('ionBackdropTap', onTap);

    tap(backdrop);

    expect(onTap).toHaveBeenCalledTimes(1);
  });

  it('should not emit ionBackdropTap when tappable is false', async () => {
    const page = await newSpecPage({
      components: [Backdrop],
      html: `<ion-backdrop tappable="false"></ion-backdrop>`,
    });

    const backdrop = page.body.querySelector('ion-backdrop')!;
    const onTap = jest.fn();
    backdrop.addEventListener('ionBackdropTap', onTap);

    tap(backdrop);

    expect(onTap).not.toHaveBeenCalled();
  });

  it('should stop the tap from reaching the page', async () => {
    const page = await newSpecPage({
      components: [Backdrop],
      html: `<ion-backdrop></ion-backdrop>`,
    });

    const onClick = jest.fn();
    page.body.addEventListener('click', onClick);

    const event = tap(page.body.querySelector('ion-backdrop')!);

    expect(onClick).not.toHaveBeenCalled();
    expect(event.defaultPrevented).toBe(true);
  });

  it('should let the tap reach the page when stopPropagation is false', async () => {
    const page = await newSpecPage({
      components: [Backdrop],
      html: `<ion-backdrop stop-propagation="false"></ion-backdrop>`,
    });

    const onClick = jest.fn();
    page.body.addEventListener('click', onClick);

    const event = tap(page.body.querySelector('ion-backdrop')!);

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(event.defaultPrevented).toBe(false);
  });
});

describe('backdrop: visible', () => {
  it('should hide the background when visible is false', async () => {
    const page = await newSpecPage({
      components: [Backdrop],
      html: `<ion-backdrop visible="false"></ion-backdrop>`,
    });

    expect(page.body.querySelector('ion-backdrop')!.classList.contains('backdrop-hide')).toBe(true);
  });

  it('should show the background by default', async () => {
    const page = await newSpecPage({
      components: [Backdrop],
      html: `<ion-backdrop></ion-backdrop>`,
    });

    expect(page.body.querySelector('ion-backdrop')!.classList.contains('backdrop-hide')).toBe(false);
  });
});
