import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('datetime: highlightedDates', () => {
  test.beforeEach(async ({ page, skip }) => {
    skip.rtl();

    await page.setContent(`
      <ion-datetime value="2023-01-01" locale="en-US"></ion-datetime>
    `);
  });

  test('should render highlights correctly when using an array', async ({ page }) => {
    const datetime = page.locator('ion-datetime');

    await datetime.evaluate((el: HTMLIonDatetimeElement) => {
      el.highlightedDates = [
        {
          date: '2023-01-01', // ensure selected date style overrides highlight
          textColor: '#800080',
          backgroundColor: '#ffc0cb',
        },
        {
          date: '2023-01-02',
          textColor: '#b22222',
          backgroundColor: '#fa8072',
        },
        {
          date: '2023-01-03',
          textColor: '#0000ff',
          backgroundColor: '#add8e6',
        },
      ];
    });

    await page.waitForChanges();
    expect(await datetime.screenshot()).toMatchSnapshot(
      `datetime-highlightedDates-array-${page.getSnapshotSettings()}.png`
    );
  });

  test('should render highlights correctly when using a callback', async ({ page }) => {
    const datetime = page.locator('ion-datetime');

    await datetime.evaluate((el: HTMLIonDatetimeElement) => {
      el.highlightedDates = (isoString) => {
        const date = new Date(isoString);
        const utcDay = date.getUTCDate();

        // ensure selected date style overrides highlight
        if (utcDay === 1) {
          return {
            textColor: '#b22222',
            backgroundColor: '#fa8072',
          };
        }

        if (utcDay % 5 === 0) {
          return {
            textColor: '#800080',
            backgroundColor: '#ffc0cb',
          };
        }

        if (utcDay % 3 === 0) {
          return {
            textColor: '#0000ff',
            backgroundColor: '#add8e6',
          };
        }

        return undefined;
      };
    });

    await page.waitForChanges();
    expect(await datetime.screenshot()).toMatchSnapshot(
      `datetime-highlightedDates-callback-${page.getSnapshotSettings()}.png`
    );
  });

  test('should render highlights correctly when only using one color or the other', async ({ page }) => {
    const datetime = page.locator('ion-datetime');

    await datetime.evaluate((el: HTMLIonDatetimeElement) => {
      el.highlightedDates = [
        {
          date: '2023-01-02',
          backgroundColor: '#fa8072',
        },
        {
          date: '2023-01-03',
          textColor: '#0000ff',
        },
      ];
    });

    await page.waitForChanges();
    expect(await datetime.screenshot()).toMatchSnapshot(
      `datetime-highlightedDates-single-color-${page.getSnapshotSettings()}.png`
    );
  });
});
