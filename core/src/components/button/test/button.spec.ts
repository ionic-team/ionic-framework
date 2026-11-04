import { newSpecPage } from '@stencil/core/testing';

import { initialize } from '../../../global/ionic-global';
import { Button } from '../button';

describe('button: shape', () => {
  beforeEach(() => {
    // Registers the global script that reads the `theme` attribute
    initialize();
  });

  it('should default to soft in the ios theme', async () => {
    const page = await newSpecPage({
      components: [Button],
      html: `<ion-button theme="ios">Button</ion-button>`,
    });

    expect(page.root!.classList.contains('button-soft')).toBe(true);
  });

  it('should default to round in the md theme', async () => {
    const page = await newSpecPage({
      components: [Button],
      html: `<ion-button theme="md">Button</ion-button>`,
    });

    expect(page.root!.classList.contains('button-round')).toBe(true);
  });

  it('should default to round in the ionic theme', async () => {
    const page = await newSpecPage({
      components: [Button],
      html: `<ion-button theme="ionic">Button</ion-button>`,
    });

    expect(page.root!.classList.contains('button-round')).toBe(true);
  });

  it('should use the shape when it is set', async () => {
    const page = await newSpecPage({
      components: [Button],
      html: `<ion-button shape="rectangular">Button</ion-button>`,
    });

    expect(page.root!.classList.contains('button-rectangular')).toBe(true);
  });
});

describe('button: fill', () => {
  it('should default to solid', async () => {
    const page = await newSpecPage({
      components: [Button],
      html: `<ion-button>Button</ion-button>`,
    });

    expect(page.root!.classList.contains('button-solid')).toBe(true);
  });

  ['ion-buttons', 'ion-datetime', 'ion-list-header'].forEach((parent) => {
    it(`should default to clear inside ${parent}`, async () => {
      const page = await newSpecPage({
        components: [Button],
        html: `<${parent}><ion-button>Button</ion-button></${parent}>`,
      });

      const button = page.body.querySelector('ion-button')!;
      expect(button.classList.contains('button-clear')).toBe(true);
    });
  });

  it('should use the fill when it is set inside ion-buttons', async () => {
    const page = await newSpecPage({
      components: [Button],
      html: `<ion-buttons><ion-button fill="solid">Button</ion-button></ion-buttons>`,
    });

    const button = page.body.querySelector('ion-button')!;
    expect(button.classList.contains('button-solid')).toBe(true);
  });
});

describe('button: size', () => {
  it('should default to medium', async () => {
    const page = await newSpecPage({
      components: [Button],
      html: `<ion-button>Button</ion-button>`,
    });

    expect(page.root!.classList.contains('button-medium')).toBe(true);
  });

  ['ion-item', 'ion-item-divider'].forEach((parent) => {
    it(`should default to small inside ${parent}`, async () => {
      const page = await newSpecPage({
        components: [Button],
        html: `<${parent}><ion-button>Button</ion-button></${parent}>`,
      });

      const button = page.body.querySelector('ion-button')!;
      expect(button.classList.contains('button-small')).toBe(true);
    });
  });

  it('should use the size when it is set inside ion-item', async () => {
    const page = await newSpecPage({
      components: [Button],
      html: `<ion-item><ion-button size="large">Button</ion-button></ion-item>`,
    });

    const button = page.body.querySelector('ion-button')!;
    expect(button.classList.contains('button-large')).toBe(true);
  });
});
