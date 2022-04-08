import { expect } from '@playwright/test';
import type { E2ELocator, E2EPage } from '@utils/test/playwright';
import { test } from '@utils/test/playwright';

test.describe('datetime: presentation', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/datetime/test/presentation`);

    await page.setIonViewport();

    /**
     * Datetime will wait a frame to display the calendar body. Wait for all
     * the test datetime components to be ready before taking a screenshot.
     */
    await Promise.all([
      page.waitForSelector('ion-datetime[presentation="date-time"].datetime-ready'),
      page.waitForSelector('ion-datetime[presentation="time-date"].datetime-ready'),
      page.waitForSelector('ion-datetime[presentation="date"].datetime-ready'),
      page.waitForSelector('ion-datetime[presentation="year"].datetime-ready'),
    ]);

    expect(await page.screenshot({ fullPage: true })).toMatchSnapshot(
      `datetime-presentation-diff-${page.getSnapshotSettings()}.png`
    );
  });
});

test.describe('datetime: presentation: time', () => {
  let timePickerFixture: TimePickerFixture;

  test.beforeEach(async ({ page }) => {
    timePickerFixture = new TimePickerFixture(page);
    await timePickerFixture.goto();
  });

  test('changing value from AM to AM should update the text', async () => {
    await timePickerFixture.setValue('04:20:00');
    await timePickerFixture.expectTime('4', '20', 'AM');

    await timePickerFixture.setValue('11:03:00');
    await timePickerFixture.expectTime('11', '03', 'AM');
  });

  test('changing value from AM to PM should update the text', async () => {
    await timePickerFixture.setValue('04:20:00');
    await timePickerFixture.expectTime('4', '20', 'AM');

    await timePickerFixture.setValue('16:40:00');
    await timePickerFixture.expectTime('4', '40', 'PM');
  });

  test('changing the value from PM to AM should update the text', async () => {
    await timePickerFixture.setValue('16:40:00');
    await timePickerFixture.expectTime('4', '40', 'PM');

    await timePickerFixture.setValue('04:20:00');
    await timePickerFixture.expectTime('4', '20', 'AM');
  });

  test('changing the value from PM to PM should update the text', async () => {
    await timePickerFixture.setValue('16:40:00');
    await timePickerFixture.expectTime('4', '40', 'PM');

    await timePickerFixture.setValue('19:32:00');
    await timePickerFixture.expectTime('7', '32', 'PM');
  });
});

class TimePickerFixture {
  readonly page: E2EPage;

  private timePicker!: E2ELocator;

  constructor(page: E2EPage) {
    this.page = page;
  }

  async goto() {
    await this.page.goto(`/src/components/datetime/test/presentation`);
    this.timePicker = this.page.locator('ion-datetime[presentation="time"]');

    await this.timePicker.scrollIntoViewIfNeeded();
  }

  async setValue(value: string) {
    await this.timePicker.evaluate((el: HTMLIonDatetimeElement, newValue: string) => {
      return new Promise((resolve, reject) => {
        const tmr = setTimeout(() => reject(), 5000);
        el.addEventListener('ionChange', (ev) => {
          clearTimeout(tmr);
          requestAnimationFrame(() => resolve(ev));
        });
        el.value = newValue;
      });
    }, value);

    await this.page.waitForChanges();
  }

  async expectTime(hour: string, minute: string, ampm: string) {
    expect(
      await this.timePicker.locator('ion-picker-column-internal:nth-child(1) .picker-item-active').textContent()
    ).toBe(hour);
    expect(
      await this.timePicker.locator('ion-picker-column-internal:nth-child(2) .picker-item-active').textContent()
    ).toBe(minute);
    expect(
      await this.timePicker.locator('ion-picker-column-internal:nth-child(3) .picker-item-active').textContent()
    ).toBe(ampm);
  }
}
