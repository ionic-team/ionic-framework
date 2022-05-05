import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('datetime: minmax', () => {
  test('calendar arrow navigation should respect min/max values', async ({ page }) => {
    test.info().annotations.push({
      type: 'issue',
      description: 'https://github.com/ionic-team/ionic-framework/issues/25073',
    });

    await page.setContent(`
      <ion-datetime min="2022-04-22" max="2022-05-21" value="2022-04-22T10:00:00"></ion-datetime>

      <script>
        const observer = new MutationObserver((mutationRecords) => {
          if (mutationRecords) {
            window.dispatchEvent(new CustomEvent('datetimeMonthDidChange'));
          }
        });

        const initDatetimeChangeEvent = () => {
          observer.observe(document.querySelector('ion-datetime').shadowRoot.querySelector('.calendar-body'), {
            subtree: true,
            childList: true
          });
        }
      </script>
  `);

    await page.waitForSelector('.datetime-ready');

    const prevButton = page.locator('ion-datetime .calendar-next-prev ion-button:nth-child(1)');
    const nextButton = page.locator('ion-datetime .calendar-next-prev ion-button:nth-child(2)');

    expect(nextButton).toBeEnabled();
    expect(prevButton).toBeDisabled();

    await page.evaluate('initDatetimeChangeEvent()');

    const monthDidChangeSpy = await page.spyOnEvent('datetimeMonthDidChange');

    await nextButton.click();
    await page.waitForChanges();

    await monthDidChangeSpy.next();

    expect(nextButton).toBeDisabled();
    expect(prevButton).toBeEnabled();
  });
});
