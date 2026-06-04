import { newSpecPage } from '@stencil/core/testing';

import { Col } from '../col';

describe('ion-col: class', () => {
  it('sets --internal-col-span for size="N"', async () => {
    const page = await newSpecPage({
      components: [Col],
      html: `<ion-col size="3"></ion-col>`,
    });

    const col = page.body.querySelector('ion-col')!;
    expect(col.classList.contains('col-size')).toBe(true);
    expect(col.style.getPropertyValue('--internal-col-span')).toBe('3');
  });

  it('applies col-auto for size="auto"', async () => {
    const page = await newSpecPage({
      components: [Col],
      html: `<ion-col size="auto"></ion-col>`,
    });

    const col = page.body.querySelector('ion-col')!;
    expect(col.classList.contains('col-auto')).toBe(true);
  });

  it('applies no sizing class for a valueless size attribute', async () => {
    const page = await newSpecPage({
      components: [Col],
      html: `<ion-col size></ion-col>`,
    });

    const col = page.body.querySelector('ion-col')!;
    const sizeClasses = Array.from(col.classList).filter((c) => c.startsWith('col-'));
    expect(sizeClasses).toEqual([]);
  });

  it('sets --internal-col-margin for offset="N"', async () => {
    const page = await newSpecPage({
      components: [Col],
      html: `<ion-col offset="2"></ion-col>`,
    });

    const col = page.body.querySelector('ion-col')!;
    expect(col.classList.contains('col-offset')).toBe(true);
    expect(col.style.getPropertyValue('--internal-col-margin')).toBe('2');
  });

  it('sets the order style for order="N"', async () => {
    const page = await newSpecPage({
      components: [Col],
      html: `<ion-col order="5"></ion-col>`,
    });

    const col = page.body.querySelector('ion-col')!;
    expect(col.style.order).toBe('5');
  });

  it('applies no sizing class for a non-numeric size value', async () => {
    const page = await newSpecPage({
      components: [Col],
      html: `<ion-col size="banana"></ion-col>`,
    });

    const col = page.body.querySelector('ion-col')!;
    const sizeClasses = Array.from(col.classList).filter((c) => c.startsWith('col-'));
    expect(sizeClasses).toEqual([]);
  });
});

// TODO(FW-7557): Remove this when the push/pull props are removed.
describe('ion-col: deprecated push/pull props', () => {
  let warnSpy: jest.SpyInstance;

  beforeEach(() => {
    warnSpy = jest.spyOn(console, 'warn').mockImplementation();
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  it('warns when push is set', async () => {
    await newSpecPage({
      components: [Col],
      html: `<ion-col push="3"></ion-col>`,
    });

    expect(warnSpy).toHaveBeenCalled();
    expect(warnSpy.mock.calls[0][0]).toEqual(expect.stringContaining('pull and push properties are deprecated'));
  });

  it('warns when pull is set', async () => {
    await newSpecPage({
      components: [Col],
      html: `<ion-col pull="3"></ion-col>`,
    });

    expect(warnSpy).toHaveBeenCalled();
  });

  it('warns when a breakpoint-suffixed push variant is set', async () => {
    await newSpecPage({
      components: [Col],
      html: `<ion-col push-md="3"></ion-col>`,
    });

    expect(warnSpy).toHaveBeenCalled();
  });

  it('does not warn when only non-deprecated props are set', async () => {
    await newSpecPage({
      components: [Col],
      html: `<ion-col size="3"></ion-col>`,
    });

    expect(warnSpy).not.toHaveBeenCalled();
  });
});
