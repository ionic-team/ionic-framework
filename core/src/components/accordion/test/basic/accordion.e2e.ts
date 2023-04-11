import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('accordion: basic', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/accordion/test/basic`);

    await page.setIonViewport();

    await expect(page).toHaveScreenshot(`accordion-basic-${page.getSnapshotSettings()}.png`);
  });
});

test.describe('accordion: ionChange', () => {
  test.beforeEach(({ skip }) => {
    skip.rtl();
  });
  test('should fire ionChange when interacting with accordions', async ({ page }) => {
    await page.setContent(`
      <ion-accordion-group value="second">
        <ion-accordion value="first">
          <button slot="header">Header</button>
          <div slot="content">First Content</div>
        </ion-accordion>
        <ion-accordion value="second">
          <button slot="header">Header</button>
          <div slot="content">Second Content</div>
        </ion-accordion>
        <ion-accordion value="third">
          <button slot="header">Header</button>
          <div slot="content">Third Content</div>
        </ion-accordion>
      </ion-accordion-group>
    `);

    const ionChange = await page.spyOnEvent('ionChange');
    const accordionHeaders = page.locator('button[slot="header"]');

    await accordionHeaders.nth(0).click();
    await expect(ionChange).toHaveReceivedEventDetail({ value: 'first' });

    await accordionHeaders.nth(1).click();
    await expect(ionChange).toHaveReceivedEventDetail({ value: 'second' });

    await accordionHeaders.nth(2).click();
    await expect(ionChange).toHaveReceivedEventDetail({ value: 'third' });
  });

  test('should not fire when programmatically setting a valid value', async ({ page }) => {
    await page.setContent(`
      <ion-accordion-group>
        <ion-accordion value="first">
          <button slot="header">Header</button>
          <div slot="content">First Content</div>
        </ion-accordion>
        <ion-accordion value="second">
          <button slot="header">Header</button>
          <div slot="content">Second Content</div>
        </ion-accordion>
        <ion-accordion value="third">
          <button slot="header">Header</button>
          <div slot="content">Third Content</div>
        </ion-accordion>
      </ion-accordion-group>

    `);

    const ionChange = await page.spyOnEvent('ionChange');
    const accordionGroup = page.locator('ion-accordion-group');

    await accordionGroup.evaluate((el: HTMLIonAccordionGroupElement) => (el.value = 'second'));
    await expect(ionChange).not.toHaveReceivedEvent();
  });
});

test.describe('accordion: animated', () => {
  test.beforeEach(({ skip }) => {
    skip.rtl();
  });
  test('should not animate when false', async ({ page }) => {
    await page.setContent(`
      <ion-accordion-group animated="false">
        <ion-accordion>
          <ion-item slot="header">Label</ion-item>
          <div slot="content">Content</div>
        </ion-accordion>
      </ion-accordion-group>
    `);

    const accordionGroup = page.locator('ion-accordion-group');
    const accordion = accordionGroup.locator('ion-accordion');
    
    const accordionGroupAnimatedAttribute = await accordionGroup.getAttribute('animated');
    expect(accordionGroupAnimatedAttribute).toBe('false');

    const accordionClass = await accordion.getAttribute('class');
    expect(accordionClass).not.toContain('accordion-animated');
  });
});