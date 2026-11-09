import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';

import { Popover } from '../../popover';

import { FOCUS_TRAP_DISABLE_CLASS } from '@utils/overlays';

describe('popover: htmlAttributes inheritance', () => {
  it('should correctly inherit attributes on host', async () => {
    const page = await newSpecPage({
      components: [Popover],
      template: () => <ion-popover overlayIndex={1} htmlAttributes={{ 'data-testid': 'basic-popover' }}></ion-popover>,
    });

    const popover = page.body.querySelector('ion-popover')!;

    await expect(popover.getAttribute('data-testid')).toBe('basic-popover');
  });
});

describe('popover: focus trap', () => {
  it('should set the focus trap class when disabled', async () => {
    const page = await newSpecPage({
      components: [Popover],
      template: () => <ion-popover focusTrap={false} overlayIndex={1}></ion-popover>,
    });

    const popover = page.body.querySelector('ion-popover')!;

    expect(popover.classList.contains(FOCUS_TRAP_DISABLE_CLASS)).toBe(true);
  });
  it('should not set the focus trap class by default', async () => {
    const page = await newSpecPage({
      components: [Popover],
      template: () => <ion-popover overlayIndex={1}></ion-popover>,
    });

    const popover = page.body.querySelector('ion-popover')!;

    expect(popover.classList.contains(FOCUS_TRAP_DISABLE_CLASS)).toBe(false);
  });
});

describe('popover: keyboardClose', () => {
  const presentWithFocusedTextarea = async (keyboardClose: boolean) => {
    const page = await newSpecPage({
      components: [Popover],
      html: `
        <textarea></textarea>
        <ion-popover></ion-popover>
      `,
    });

    const textarea = page.body.querySelector('textarea')!;
    const popover = page.body.querySelector('ion-popover')!;
    const onBlur = jest.fn();
    textarea.addEventListener('blur', onBlur);
    Object.defineProperty(page.doc, 'activeElement', { configurable: true, get: () => textarea });

    popover.keyboardClose = keyboardClose;
    await popover.present();

    return onBlur;
  };

  it('should not blur the focused element when keyboardClose is false', async () => {
    const onBlur = await presentWithFocusedTextarea(false);

    expect(onBlur).not.toHaveBeenCalled();
  });

  it('should blur the focused element when keyboardClose is true', async () => {
    const onBlur = await presentWithFocusedTextarea(true);

    expect(onBlur).toHaveBeenCalled();
  });
});
