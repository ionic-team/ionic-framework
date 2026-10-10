import { newSpecPage } from '@stencil/core/testing';

import { config } from '../../../global/config';
import { ToolbarTitle } from '../title';

describe('title: classes', () => {
  it('should add the medium size class when size is not set', async () => {
    const page = await newSpecPage({
      components: [ToolbarTitle],
      html: `<ion-title>Title</ion-title>`,
    });

    expect(page.root!.classList.contains('title-size-medium')).toBe(true);
  });

  it('should add the size class when size is set', async () => {
    const page = await newSpecPage({
      components: [ToolbarTitle],
      html: `<ion-title size="large">Title</ion-title><ion-title size="small">Title</ion-title>`,
    });

    const [large, small] = Array.from(page.body.querySelectorAll('ion-title'));
    expect(large.classList.contains('title-size-large')).toBe(true);
    expect(small.classList.contains('title-size-small')).toBe(true);
  });

  it('should add the color classes when color is set', async () => {
    const page = await newSpecPage({
      components: [ToolbarTitle],
      html: `<ion-title color="primary">Title</ion-title>`,
    });

    expect(page.root!.classList.contains('ion-color')).toBe(true);
    expect(page.root!.classList.contains('ion-color-primary')).toBe(true);
  });

  it('should add the bold hue class when hue is not set', async () => {
    const page = await newSpecPage({
      components: [ToolbarTitle],
      html: `<ion-title>Title</ion-title>`,
    });

    expect(page.root!.classList.contains('title-hue-bold')).toBe(true);
  });

  it('should add the hue class when hue is set', async () => {
    const page = await newSpecPage({
      components: [ToolbarTitle],
      html: `<ion-title hue="subtle">Title</ion-title>`,
    });

    expect(page.root!.classList.contains('title-hue-subtle')).toBe(true);
    expect(page.root!.classList.contains('title-hue-bold')).toBe(false);
  });

  /**
   * The iOS collapsing header and page transition look up this
   * element and measure it, so it must keep its class.
   */
  it('should render the inner title element', async () => {
    const page = await newSpecPage({
      components: [ToolbarTitle],
      html: `<ion-title>Title</ion-title>`,
    });

    expect(page.root!.shadowRoot!.querySelector('.toolbar-title')).not.toBeNull();
  });
});

describe('title: style event', () => {
  it('should emit the size class when size changes', async () => {
    const page = await newSpecPage({
      components: [ToolbarTitle],
      html: `<ion-title>Title</ion-title>`,
    });

    const ionStyle = jest.fn();
    page.root!.addEventListener('ionStyle', (ev: Event) => ionStyle((ev as CustomEvent).detail));

    page.root!.setAttribute('size', 'large');
    await page.waitForChanges();

    expect(ionStyle).toHaveBeenCalledWith({ 'title-size-large': true });
  });
});

describe('title: config', () => {
  beforeEach(() => {
    config.reset({
      customTheme: { config: { components: { IonTitle: { size: 'large', hue: 'subtle' } } } },
    });
  });

  afterEach(() => {
    config.reset({});
  });

  it('should use the config values when the props are not set', async () => {
    const page = await newSpecPage({
      components: [ToolbarTitle],
      html: `<ion-title>Title</ion-title>`,
    });

    expect(page.root!.classList.contains('title-size-large')).toBe(true);
    expect(page.root!.classList.contains('title-hue-subtle')).toBe(true);
  });

  it('should use the props over the config values', async () => {
    const page = await newSpecPage({
      components: [ToolbarTitle],
      html: `<ion-title size="small" hue="bold">Title</ion-title>`,
    });

    expect(page.root!.classList.contains('title-size-small')).toBe(true);
    expect(page.root!.classList.contains('title-hue-bold')).toBe(true);
  });
});
