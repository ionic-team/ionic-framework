import { newSpecPage } from '@stencil/core/testing';

import { Content } from '../content';

describe('content: transition shadow', () => {
  it('should render transition effect elements in ios mode', async () => {
    const page = await newSpecPage({
      components: [Content],
      html: `<ion-content mode="ios"></ion-content>`,
    });

    const content = page.body.querySelector('ion-content')!;
    expect(content.shadowRoot!.querySelector('.transition-effect')).not.toBeNull();
  });

  it('should not render transition effect elements in md mode', async () => {
    const page = await newSpecPage({
      components: [Content],
      html: `<ion-content mode="md"></ion-content>`,
    });

    const content = page.body.querySelector('ion-content')!;
    expect(content.shadowRoot!.querySelector('.transition-effect')).toBeNull();
  });
});

describe('content: element refs', () => {
  it('getScrollElement should return the scroll element', async () => {
    const page = await newSpecPage({
      components: [Content],
      html: `<ion-content></ion-content>`,
    });

    const content = page.body.querySelector('ion-content')!;
    const scrollEl = await content.getScrollElement();

    expect(scrollEl).toBe(content.shadowRoot!.querySelector('[part="scroll"]'));
  });

  it('getBackgroundElement should return the background element', async () => {
    const page = await newSpecPage({
      components: [Content],
      html: `<ion-content></ion-content>`,
    });

    const content = page.body.querySelector('ion-content')!;
    const backgroundEl = await content.getBackgroundElement();

    expect(backgroundEl).toBe(content.shadowRoot!.querySelector('[part="background"]'));
  });
});

describe('content: fixed slot placement', () => {
  it('should should fixed slot after content', async () => {
    const page = await newSpecPage({
      components: [Content],
      html: '<ion-content></ion-content>',
    });

    const content = page.body.querySelector('ion-content')!;
    const fixedSlot = content.shadowRoot!.querySelector('slot[name="fixed"]')!;
    const scrollEl = content.shadowRoot!.querySelector('[part="scroll"]')!;

    expect(fixedSlot.nextElementSibling).not.toBe(scrollEl);
  });

  it('should should fixed slot before content', async () => {
    const page = await newSpecPage({
      components: [Content],
      html: `<ion-content fixed-slot-placement="before"></ion-content>`,
    });

    const content = page.body.querySelector('ion-content')!;
    const fixedSlot = content.shadowRoot!.querySelector('slot[name="fixed"]')!;
    const scrollEl = content.shadowRoot!.querySelector('[part="scroll"]')!;

    expect(fixedSlot.nextElementSibling).toBe(scrollEl);
  });
});
