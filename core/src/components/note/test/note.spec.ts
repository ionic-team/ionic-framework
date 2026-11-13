import { newSpecPage } from '@stencil/core/testing';

import { config } from '../../../global/config';
import { Note } from '../note';

describe('note: classes', () => {
  it('should add the color classes when color is set', async () => {
    const page = await newSpecPage({
      components: [Note],
      html: `<ion-note color="primary">Note</ion-note>`,
    });

    expect(page.root!.classList.contains('ion-color')).toBe(true);
    expect(page.root!.classList.contains('ion-color-primary')).toBe(true);
  });

  it('should add the bold hue class when hue is not set', async () => {
    const page = await newSpecPage({
      components: [Note],
      html: `<ion-note>Note</ion-note>`,
    });

    expect(page.root!.classList.contains('note-hue-bold')).toBe(true);
  });

  it('should add the hue class when hue is set', async () => {
    const page = await newSpecPage({
      components: [Note],
      html: `<ion-note hue="subtle">Note</ion-note>`,
    });

    expect(page.root!.classList.contains('note-hue-subtle')).toBe(true);
    expect(page.root!.classList.contains('note-hue-bold')).toBe(false);
  });
});

describe('note: config', () => {
  beforeEach(() => {
    config.reset({
      customTheme: { config: { components: { IonNote: { hue: 'subtle' } } } },
    });
  });

  afterEach(() => {
    config.reset({});
  });

  it('should use the config hue when the prop is not set', async () => {
    const page = await newSpecPage({
      components: [Note],
      html: `<ion-note>Note</ion-note>`,
    });

    expect(page.root!.classList.contains('note-hue-subtle')).toBe(true);
  });

  it('should use the hue prop over the config value', async () => {
    const page = await newSpecPage({
      components: [Note],
      html: `<ion-note hue="bold">Note</ion-note>`,
    });

    expect(page.root!.classList.contains('note-hue-bold')).toBe(true);
  });
});
