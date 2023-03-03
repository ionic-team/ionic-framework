import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';
import type { E2EPage } from '@utils/test/playwright';

class SelectPopoverSizeFixture {
  readonly page: E2EPage;

  constructor(page: E2EPage) {
    this.page = page;
  }

  async setContent(placement: string, fill?: string) {
    const { page } = this;
    const fillString = fill !== undefined ? ` fill=${fill}` : '';
    await page.setContent(`
      <ion-select interface="popover" label="My Label" label-placement="${placement}"${fillString}>
        <ion-select-option value="apple">Apple</ion-select-option>
      </ion-select>
    `);
  }

  async openPopover() {
    const { page } = this;

    const ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');
    await page.click('ion-select');

    await ionPopoverDidPresent.next();
  }

  async expectPopoverSize(size: string) {
    const { page } = this;

    const popover = page.locator('ion-popover');

    await expect(popover).toHaveJSProperty('size', size);
  }
}

test.describe('select: popover sizing', () => {
  test.beforeEach(async ({ skip }) => {
    skip.rtl();
  });

  test('popover should have cover size with a floating label', async ({ page }) => {
    const fixture = new SelectPopoverSizeFixture(page);

    await fixture.setContent('floating');
    await fixture.openPopover();
    await fixture.expectPopoverSize('cover');
  });

  test('popover should have cover size with a stacked label', async ({ page }) => {
    const fixture = new SelectPopoverSizeFixture(page);

    await fixture.setContent('stacked');
    await fixture.openPopover();
    await fixture.expectPopoverSize('cover');
  });

  test('popover should have auto size with a start label', async ({ page }) => {
    const fixture = new SelectPopoverSizeFixture(page);

    await fixture.setContent('start');
    await fixture.openPopover();
    await fixture.expectPopoverSize('auto');
  });

  test('popover should have auto size with a end label', async ({ page }) => {
    const fixture = new SelectPopoverSizeFixture(page);

    await fixture.setContent('end');
    await fixture.openPopover();
    await fixture.expectPopoverSize('auto');
  });

  test('popover should have auto size with a fixed label', async ({ page }) => {
    const fixture = new SelectPopoverSizeFixture(page);

    await fixture.setContent('fixed');
    await fixture.openPopover();
    await fixture.expectPopoverSize('auto');
  });

  test('popover should have cover size with outline fill in MD', async ({ page, skip }) => {
    skip.mode('ios');

    const fixture = new SelectPopoverSizeFixture(page);

    await fixture.setContent('start', 'outline');
    await fixture.openPopover();
    await fixture.expectPopoverSize('cover');
  });

  test('popover should have cover size with solid fill in MD', async ({ page, skip }) => {
    skip.mode('ios');

    const fixture = new SelectPopoverSizeFixture(page);

    await fixture.setContent('start', 'solid');
    await fixture.openPopover();
    await fixture.expectPopoverSize('cover');
  });
});
