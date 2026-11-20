import { newSpecPage } from '@stencil/core/testing';

import { config } from '../../../global/config';
import { Divider } from '../divider';

describe('divider: spacing', () => {
  afterEach(() => {
    config.reset({});
  });

  it('should default to medium when the theme config has no spacing', async () => {
    const page = await newSpecPage({
      components: [Divider],
      html: `<ion-divider></ion-divider>`,
    });

    expect(page.root!.classList.contains('divider-spacing-medium')).toBe(true);
  });

  it('should use the spacing from the theme config', async () => {
    config.reset({ customTheme: { config: { components: { IonDivider: { spacing: 'large' } } } } });

    const page = await newSpecPage({
      components: [Divider],
      html: `<ion-divider></ion-divider>`,
    });

    expect(page.root!.classList.contains('divider-spacing-large')).toBe(true);
  });

  it('should use the spacing when it is set', async () => {
    config.reset({ customTheme: { config: { components: { IonDivider: { spacing: 'large' } } } } });

    const page = await newSpecPage({
      components: [Divider],
      html: `<ion-divider spacing="xsmall"></ion-divider>`,
    });

    expect(page.root!.classList.contains('divider-spacing-xsmall')).toBe(true);
  });
});
