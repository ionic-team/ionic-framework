import { expect } from '@playwright/test';
import { dragElementBy, test } from '@utils/test/playwright';

for (const expandToScroll of [true, false]) {
  test(`sheet inset follows presentation, drag and programmatic detents (expandToScroll=${expandToScroll})`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 402, height: 874 });
    await page.setContent('<ion-app><ion-content>Background</ion-content></ion-app>', {
      mode: 'ios',
      direction: 'ltr',
      palette: 'light',
    });
    await page.evaluate(async (expand) => {
      const modal = document.createElement('ion-modal');
      modal.style.cssText = '--height: 800px; --sheet-inset: calc(4px + 4px); --border-radius: 32px';
      modal.breakpoints = [0, 0.5, 0.75, 1];
      modal.initialBreakpoint = 0.75;
      modal.expandToScroll = expand;
      const content = document.createElement('div');
      content.innerHTML =
        '<ion-header><ion-toolbar><ion-title>Sheet</ion-title></ion-toolbar></ion-header><ion-content><div style="height: 1600px">Scrollable content</div></ion-content><ion-footer><ion-toolbar>Footer</ion-toolbar></ion-footer>';
      modal.component = content;
      document.body.append(modal);
      await modal.present();
    }, expandToScroll);
    const modal = page.locator('ion-modal');
    const wrapper = modal.locator('.modal-wrapper');
    const geometry = () =>
      wrapper.evaluate((element) => {
        const rect = element.getBoundingClientRect();
        return { left: Math.round(rect.left), width: Math.round(rect.width) };
      });
    await expect.poll(geometry).toEqual({ left: 8, width: 386 });
    await expect
      .poll(() => modal.locator('ion-content').evaluate((element: HTMLIonContentElement) => element.scrollY))
      .toBe(!expandToScroll);
    if (!expandToScroll) {
      await expect
        .poll(() =>
          modal.locator('ion-footer').evaluate((element) => Math.round(element.getBoundingClientRect().bottom))
        )
        .toBe(866);
    }
    // The gap and clipped lower corners must hit the backdrop, not invisible sheet content.
    await expect
      .poll(() => modal.evaluate((element) => element.shadowRoot!.elementFromPoint(201, 870)?.tagName))
      .toBe('ION-BACKDROP');
    for (const breakpoint of [1, 0.5, 0.75]) {
      await modal.evaluate((element: HTMLIonModalElement, value) => element.setCurrentBreakpoint(value), breakpoint);
      await expect.poll(geometry).toEqual(breakpoint === 1 ? { left: 0, width: 402 } : { left: 8, width: 386 });
    }
    const handle = (await modal.locator('.modal-handle').boundingBox())!;
    const x = handle.x + handle.width / 2;
    const y = handle.y + handle.height / 2;
    await dragElementBy(modal.locator('.modal-handle'), page, 0, -100, undefined, undefined, false);
    await expect.poll(async () => (await geometry()).left).toBeGreaterThan(0);
    await expect.poll(async () => (await geometry()).left).toBeLessThan(8);
    await expect(modal.locator('.ion-page ion-footer')).toHaveCount(1);
    for (let i = 1; i <= 14; i++) {
      await page.mouse.move(x, y - 100 - i * 10);
      await page.evaluate(() => new Promise(requestAnimationFrame));
    }
    await page.mouse.up();
    await expect.poll(() => modal.evaluate((element: HTMLIonModalElement) => element.getCurrentBreakpoint())).toBe(1);
    await expect.poll(geometry).toEqual({ left: 0, width: 402 });
    await modal.evaluate(async (element: HTMLIonModalElement) => {
      await element.setCurrentBreakpoint(0.75);
      await element.dismiss();
    });
    await expect(modal).toBeHidden();
    await modal.evaluate((element: HTMLIonModalElement) => element.present());
    await expect.poll(geometry).toEqual({ left: 8, width: 386 });
    await page.setViewportSize({ width: 430, height: 932 });
    await expect.poll(geometry).toEqual({ left: 8, width: 414 });
    await modal.evaluate((element) => {
      element.style.setProperty('--sheet-inset', '0px');
      window.dispatchEvent(new Event('resize'));
    });
    await expect.poll(geometry).toEqual({ left: 0, width: 430 });
    await expect(wrapper).toHaveCSS('clip-path', 'none');
    await modal.evaluate((element: HTMLIonModalElement) => {
      element.style.setProperty('--sheet-inset', '8px');
      element.canDismiss = false;
      window.dispatchEvent(new Event('resize'));
    });
    await expect.poll(geometry).toEqual({ left: 8, width: 414 });
    await dragElementBy(modal.locator('.modal-handle'), page, 0, 400);
    await expect
      .poll(() => modal.evaluate((element: HTMLIonModalElement) => element.getCurrentBreakpoint()))
      .toBe(0.75);
    await expect(modal).toBeVisible();
    await modal.evaluate((element: HTMLIonModalElement) => {
      element.canDismiss = true;
    });
    await page.mouse.click(200, 50);
    await expect(modal).toBeHidden();
  });
}

for (const mode of ['ios', 'md'] as const) {
  test(`sheet inset is opt-in and restricted to iOS (${mode})`, async ({ page }) => {
    await page.setViewportSize({ width: 402, height: 874 });
    await page.setContent('<ion-app></ion-app>', { mode, direction: 'ltr', palette: 'light' });
    await page.evaluate(async (mode) => {
      const modal = document.createElement('ion-modal');
      modal.style.setProperty('--sheet-inset', mode === 'md' ? '8px' : '0px');
      modal.breakpoints = [0, 0.75, 1];
      modal.initialBreakpoint = 0.75;
      modal.component = 'ion-content';
      document.body.append(modal);
      await modal.present();
    }, mode);
    const wrapper = page.locator('ion-modal .modal-wrapper');
    await expect.poll(() => wrapper.evaluate((element) => Math.round(element.getBoundingClientRect().width))).toBe(402);
    await expect(wrapper).toHaveCSS('clip-path', 'none');
  });
}
