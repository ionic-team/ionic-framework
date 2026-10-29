import { newSpecPage } from '@stencil/core/testing';

import { config } from '../../../global/config';
import { Button } from '../button';

describe('button: shape', () => {
  afterEach(() => {
    config.reset({});
  });

  it('should default to round when the theme config has no shape', async () => {
    const page = await newSpecPage({
      components: [Button],
      html: `<ion-button>Button</ion-button>`,
    });

    expect(page.root!.classList.contains('button-shape-round')).toBe(true);
  });

  it('should use the shape from the theme config', async () => {
    config.reset({ customTheme: { config: { components: { IonButton: { shape: 'soft' } } } } });

    const page = await newSpecPage({
      components: [Button],
      html: `<ion-button>Button</ion-button>`,
    });

    expect(page.root!.classList.contains('button-shape-soft')).toBe(true);
  });

  it('should use the shape when it is set', async () => {
    config.reset({ customTheme: { config: { components: { IonButton: { shape: 'soft' } } } } });

    const page = await newSpecPage({
      components: [Button],
      html: `<ion-button shape="rectangular">Button</ion-button>`,
    });

    expect(page.root!.classList.contains('button-shape-rectangular')).toBe(true);
  });
});

describe('button: fill', () => {
  afterEach(() => {
    config.reset({});
  });

  it('should default to solid', async () => {
    const page = await newSpecPage({
      components: [Button],
      html: `<ion-button>Button</ion-button>`,
    });

    expect(page.root!.classList.contains('button-fill-solid')).toBe(true);
  });

  ['ion-buttons', 'ion-datetime', 'ion-list-header'].forEach((parent) => {
    it(`should default to clear inside ${parent}`, async () => {
      const page = await newSpecPage({
        components: [Button],
        html: `<${parent}><ion-button>Button</ion-button></${parent}>`,
      });

      const button = page.body.querySelector('ion-button')!;
      expect(button.classList.contains('button-fill-clear')).toBe(true);
    });
  });

  it('should use the fill from the theme config', async () => {
    config.reset({ customTheme: { config: { components: { IonButton: { fill: 'outline' } } } } });

    const page = await newSpecPage({
      components: [Button],
      html: `<ion-button>Button</ion-button>`,
    });

    expect(page.root!.classList.contains('button-fill-outline')).toBe(true);
  });

  it('should default to clear inside ion-buttons when the theme config has a fill', async () => {
    config.reset({ customTheme: { config: { components: { IonButton: { fill: 'outline' } } } } });

    const page = await newSpecPage({
      components: [Button],
      html: `<ion-buttons><ion-button>Button</ion-button></ion-buttons>`,
    });

    const button = page.body.querySelector('ion-button')!;
    expect(button.classList.contains('button-fill-clear')).toBe(true);
  });

  it('should use the fill when it is set inside ion-buttons', async () => {
    const page = await newSpecPage({
      components: [Button],
      html: `<ion-buttons><ion-button fill="solid">Button</ion-button></ion-buttons>`,
    });

    const button = page.body.querySelector('ion-button')!;
    expect(button.classList.contains('button-fill-solid')).toBe(true);
  });
});

describe('button: size', () => {
  afterEach(() => {
    config.reset({});
  });

  it('should default to medium', async () => {
    const page = await newSpecPage({
      components: [Button],
      html: `<ion-button>Button</ion-button>`,
    });

    expect(page.root!.classList.contains('button-size-medium')).toBe(true);
  });

  it('should use the size from the theme config', async () => {
    config.reset({ customTheme: { config: { components: { IonButton: { size: 'large' } } } } });

    const page = await newSpecPage({
      components: [Button],
      html: `<ion-button>Button</ion-button>`,
    });

    expect(page.root!.classList.contains('button-size-large')).toBe(true);
  });

  it('should default to small inside ion-item when the theme config has a size', async () => {
    config.reset({ customTheme: { config: { components: { IonButton: { size: 'large' } } } } });

    const page = await newSpecPage({
      components: [Button],
      html: `<ion-item><ion-button>Button</ion-button></ion-item>`,
    });

    const button = page.body.querySelector('ion-button')!;
    expect(button.classList.contains('button-size-small')).toBe(true);
  });

  ['ion-item', 'ion-item-divider'].forEach((parent) => {
    it(`should default to small inside ${parent}`, async () => {
      const page = await newSpecPage({
        components: [Button],
        html: `<${parent}><ion-button>Button</ion-button></${parent}>`,
      });

      const button = page.body.querySelector('ion-button')!;
      expect(button.classList.contains('button-size-small')).toBe(true);
    });
  });

  it('should render the deprecated default size as medium', async () => {
    const page = await newSpecPage({
      components: [Button],
      html: `<ion-button size="default">Button</ion-button>`,
    });

    expect(page.root!.classList.contains('button-size-medium')).toBe(true);
  });

  it('should use the size when it is set inside ion-item', async () => {
    const page = await newSpecPage({
      components: [Button],
      html: `<ion-item><ion-button size="large">Button</ion-button></ion-item>`,
    });

    const button = page.body.querySelector('ion-button')!;
    expect(button.classList.contains('button-size-large')).toBe(true);
  });
});

describe('button: hue', () => {
  afterEach(() => {
    config.reset({});
  });

  it('should default to bold', async () => {
    const page = await newSpecPage({
      components: [Button],
      html: `<ion-button>Button</ion-button>`,
    });

    expect(page.root!.classList.contains('button-hue-bold')).toBe(true);
  });

  it('should use the hue from the theme config', async () => {
    config.reset({ customTheme: { config: { components: { IonButton: { hue: 'subtle' } } } } });

    const page = await newSpecPage({
      components: [Button],
      html: `<ion-button>Button</ion-button>`,
    });

    expect(page.root!.classList.contains('button-hue-subtle')).toBe(true);
  });
});

describe('button: ripple effect', () => {
  afterEach(() => {
    config.reset({});
  });

  it('should render a ripple in md mode when the theme config has no rippleEffect', async () => {
    const page = await newSpecPage({
      components: [Button],
      html: `<ion-button mode="md">Button</ion-button>`,
    });

    expect(page.root!.shadowRoot!.querySelector('ion-ripple-effect')).not.toBeNull();
  });

  it('should not render a ripple in ios mode when the theme config has no rippleEffect', async () => {
    const page = await newSpecPage({
      components: [Button],
      html: `<ion-button mode="ios">Button</ion-button>`,
    });

    expect(page.root!.shadowRoot!.querySelector('ion-ripple-effect')).toBeNull();
  });

  it('should render a ripple in ios mode when rippleEffect is enabled', async () => {
    config.reset({ rippleEffect: true });

    const page = await newSpecPage({
      components: [Button],
      html: `<ion-button mode="ios">Button</ion-button>`,
    });

    expect(page.root!.shadowRoot!.querySelector('ion-ripple-effect')).not.toBeNull();
  });

  it('should not render a ripple in md mode when rippleEffect is disabled', async () => {
    config.reset({ rippleEffect: false });

    const page = await newSpecPage({
      components: [Button],
      html: `<ion-button mode="md">Button</ion-button>`,
    });

    expect(page.root!.shadowRoot!.querySelector('ion-ripple-effect')).toBeNull();
  });
});
