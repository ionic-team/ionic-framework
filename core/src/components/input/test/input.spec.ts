import { newSpecPage } from '@stencil/core/testing';
import { Input } from '../input';

describe('input: rendering', () => {
  it('should inherit attributes', async () => {
    const page = await newSpecPage({
      components: [Input],
      html: '<ion-input title="my title" tabindex="-1" data-form-type="password"></ion-input>',
    });

    const nativeEl = page.body.querySelector('ion-input input');
    expect(nativeEl.getAttribute('title')).toBe('my title');
    expect(nativeEl.getAttribute('tabindex')).toBe('-1');
    expect(nativeEl.getAttribute('data-form-type')).toBe('password');
  });

  it('should render bottom content when helper text is defined', async () => {
    const page = await newSpecPage({
      components: [Input],
      html: `<ion-input label="Input" helper-text="Helper Text"></ion-input>`,
    });

    const bottomContent = page.body.querySelector('ion-input .input-bottom');
    expect(bottomContent).not.toBe(null);
  });

  it('should render bottom content when helper text is undefined', async () => {
    const page = await newSpecPage({
      components: [Input],
      html: `<ion-input label="Input"></ion-input>`,
    });

    const bottomContent = page.body.querySelector('ion-input .input-bottom');
    expect(bottomContent).toBe(null);
  });

  it('should render bottom content when helper text is empty string', async () => {
    const page = await newSpecPage({
      components: [Input],
      html: `<ion-input label="Input" helper-text=""></ion-input>`,
    });

    const bottomContent = page.body.querySelector('ion-input .input-bottom');
    expect(bottomContent).toBe(null);
  });
});
