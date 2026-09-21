import { newSpecPage } from '@stencil/core/testing';

import { config } from '../../../global/config';
import { Loading } from '../loading';

describe('loading: custom html', () => {
  let consoleWarnSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleWarnSpy = jest.spyOn(console, 'warn');
    // Suppress console.warn output from polluting the test output
    consoleWarnSpy.mockImplementation(() => {});
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
  });

  it('should not allow for custom html by default', async () => {
    const page = await newSpecPage({
      components: [Loading],
      html: `<ion-loading message="<button class='custom-html'>Custom Text</button>"></ion-loading>`,
    });

    const content = page.body.querySelector('.loading-content')!;
    expect(content.textContent).toContain('Custom Text');
    expect(content.querySelector('button.custom-html')).toBe(null);
  });

  it('should discard a message carrying an onload handler', async () => {
    config.reset({ innerHTMLTemplatesEnabled: true });
    const page = await newSpecPage({
      components: [Loading],
      html: `<ion-loading message="<svg><svg onLoad='alert(1)'></svg></svg>Custom Text"></ion-loading>`,
    });

    const content = page.body.querySelector('.loading-content')!;
    expect(content.innerHTML).toEqual('');
  });

  it('should allow for custom html', async () => {
    config.reset({ innerHTMLTemplatesEnabled: true });
    const page = await newSpecPage({
      components: [Loading],
      html: `<ion-loading message="<button class='custom-html'>Custom Text</button>"></ion-loading>`,
    });

    const content = page.body.querySelector('.loading-content')!;
    expect(content.textContent).toContain('Custom Text');
    expect(content.querySelector('button.custom-html')).not.toBe(null);
  });

  it('should not allow for custom html', async () => {
    config.reset({ innerHTMLTemplatesEnabled: false });
    const page = await newSpecPage({
      components: [Loading],
      html: `<ion-loading message="<button class='custom-html'>Custom Text</button>"></ion-loading>`,
    });

    const content = page.body.querySelector('.loading-content')!;
    expect(content.textContent).toContain('Custom Text');
    expect(content.querySelector('button.custom-html')).toBe(null);
  });
});
