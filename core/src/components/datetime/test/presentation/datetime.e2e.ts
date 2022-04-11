import { expect } from '@playwright/test';
import type { E2ELocator, E2EPage } from '@utils/test/playwright';
import { test } from '@utils/test/playwright';

test.describe('datetime: presentation', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/datetime/test/presentation`);

    await page.setIonViewport();

    const compares = [];
    const presentations = ['date-time', 'time-date', 'time', 'date', 'month-year', 'month', 'year'];

    for (const presentation of presentations) {
      await page.locator('select').selectOption(presentation);
      await page.waitForChanges();
      compares.push({
        presentation,
        screenshot: await page.screenshot({ fullPage: true }),
      });
    }

    for (const compare of compares) {
      expect(compare.screenshot).toMatchSnapshot(`datetime-presentation-${compare.presentation}-diff-${page.getSnapshotSettings()}.png`)
    }
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
    await this.page.locator('select').selectOption('time');
    this.timePicker = this.page.locator('ion-datetime');
  }

  async setValue(value: string) {
    const ionChange = await this.page.spyOnEvent('ionChange');
    await this.timePicker.evaluate((el: HTMLIonDatetimeElement, newValue: string) => {
      el.value = newValue;
    }, value);

    await ionChange.next();

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
