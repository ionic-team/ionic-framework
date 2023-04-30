import { newSpecPage } from '@stencil/core/testing';

import { Input } from '../input';

it('should inherit attributes', async () => {
  const page = await newSpecPage({
    components: [Input],
    html: '<ion-input title="my title" tabindex="-1" data-form-type="password"></ion-input>',
  });

  const nativeEl = page.body.querySelector('ion-input input')!;
  expect(nativeEl.getAttribute('title')).toBe('my title');
  expect(nativeEl.getAttribute('tabindex')).toBe('-1');
  expect(nativeEl.getAttribute('data-form-type')).toBe('password');
});

describe('input masking', () => {
  it('should have a default mask visibility', async () => {
    const page = await newSpecPage({
      components: [Input],
      html: `<ion-input></ion-input>`,
    });

    const input = page.body.querySelector('ion-input')!;

    expect(input.maskVisibility).toBe('always');
  });

  it('should have a default mask placeholder', async () => {
    const page = await newSpecPage({
      components: [Input],
      html: `<ion-input></ion-input>`,
    });

    const input = page.body.querySelector('ion-input')!;

    expect(input.maskPlaceholder).toBe('_');
  });
});
