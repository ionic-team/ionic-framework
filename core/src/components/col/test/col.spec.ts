import { newSpecPage } from '@stencil/core/testing';

import { Col } from '../col';

describe('ion-col: class', () => {
  it('applies ion-grid-col--N for size="N"', async () => {
    const page = await newSpecPage({
      components: [Col],
      html: `<ion-col size="3"></ion-col>`,
    });

    const col = page.body.querySelector('ion-col')!;
    expect(col.classList.contains('ion-grid-col--3')).toBe(true);
  });

  it('applies ion-grid-col-auto for size="auto"', async () => {
    const page = await newSpecPage({
      components: [Col],
      html: `<ion-col size="auto"></ion-col>`,
    });

    const col = page.body.querySelector('ion-col')!;
    expect(col.classList.contains('ion-grid-col-auto')).toBe(true);
  });

  it('applies no sizing class for a value-less size attribute', async () => {
    const page = await newSpecPage({
      components: [Col],
      html: `<ion-col size></ion-col>`,
    });

    const col = page.body.querySelector('ion-col')!;
    const sizeClasses = Array.from(col.classList).filter((c) => c.startsWith('ion-grid-col'));
    expect(sizeClasses).toEqual([]);
  });

  it('applies ion-grid-offset-col--N for offset="N"', async () => {
    const page = await newSpecPage({
      components: [Col],
      html: `<ion-col offset="2"></ion-col>`,
    });

    const col = page.body.querySelector('ion-col')!;
    expect(col.classList.contains('ion-grid-offset-col--2')).toBe(true);
  });

  it('applies ion-grid-order-col--N for order="N"', async () => {
    const page = await newSpecPage({
      components: [Col],
      html: `<ion-col order="5"></ion-col>`,
    });

    const col = page.body.querySelector('ion-col')!;
    expect(col.classList.contains('ion-grid-order-col--5')).toBe(true);
  });

  it('applies no sizing class for a non-numeric size value', async () => {
    const page = await newSpecPage({
      components: [Col],
      html: `<ion-col size="banana"></ion-col>`,
    });

    const col = page.body.querySelector('ion-col')!;
    const sizeClasses = Array.from(col.classList).filter((c) => c.startsWith('ion-grid-col'));
    expect(sizeClasses).toEqual([]);
  });
});

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
