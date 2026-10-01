import type { Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

const getToggle = (datetime: Locator) => datetime.locator('.datetime-input-mode-toggle');

// `ion-button` moves its `aria-label` onto the native button inside it.
const getToggleLabel = (datetime: Locator) => getToggle(datetime).locator('button').getAttribute('aria-label');
const getDateField = (datetime: Locator) => datetime.locator('.datetime-input ion-input input');

/**
 * The month whose block starts at the top of a vertical list, as "year-month".
 */
const getMonthAtTop = (datetime: Locator) =>
  datetime.locator('.calendar-body').evaluate((body: HTMLElement) => {
    const top = body.getBoundingClientRect().top;
    const month = Array.from(body.querySelectorAll<HTMLElement>('.calendar-month')).find(
      (el) => Math.abs(el.getBoundingClientRect().top - top) < 1
    );
    return month ? `${month.dataset.year}-${month.dataset.month}` : undefined;
  });

/**
 * This behavior does not vary across modes/directions.
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('datetime: input mode'), () => {
    test('should switch between the calendar and a date field', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime presentation="date" show-default-title="true" value="2022-06-03"></ion-datetime>
      `,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      const datetime = page.locator('ion-datetime');
      const toggle = getToggle(datetime);

      expect(await getToggleLabel(datetime)).toBe('Switch to text input mode');

      await toggle.click();

      await expect(datetime.locator('.calendar-body')).toBeHidden();
      await expect(getDateField(datetime)).toHaveValue('06/03/2022');
      await expect(getDateField(datetime)).toHaveAttribute('placeholder', 'mm/dd/yyyy');
      await expect.poll(() => getToggleLabel(datetime)).toBe('Switch to calendar input mode');

      await toggle.click();

      await expect(datetime.locator('.calendar-body')).toBeVisible();
      await expect(datetime.locator('.datetime-input')).toHaveCount(0);
      await expect(datetime.locator('.calendar-month-year-toggle')).toHaveText(/June 2022/);
    });

    ['horizontal', 'vertical'].forEach((orientation) => {
      test(`should keep its height when switching modes in ${orientation}`, async ({ page }) => {
        await page.setContent(
          `
          <ion-datetime
            presentation="date"
            navigation-orientation="${orientation}"
            show-default-title="true"
            value="2022-06-03"
          ></ion-datetime>
        `,
          config
        );
        await page.locator('.datetime-ready').waitFor();

        const datetime = page.locator('ion-datetime');
        const getHeight = async () => (await datetime.boundingBox())!.height;

        const calendarHeight = await getHeight();

        await getToggle(datetime).click();
        await expect(getDateField(datetime)).toBeVisible();
        expect(await getHeight()).toBe(calendarHeight);

        await getToggle(datetime).click();
        await expect(datetime.locator('.calendar-body')).toBeVisible();
        expect(await getHeight()).toBe(calendarHeight);
      });
    });

    test('should select a typed date and return to its month', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime presentation="date" show-default-title="true" value="2022-06-03"></ion-datetime>
      `,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      const datetime = page.locator('ion-datetime');
      const ionChange = await page.spyOnEvent('ionChange');

      await getToggle(datetime).click();
      await getDateField(datetime).fill('08/15/2027');

      await ionChange.next();
      expect(ionChange).toHaveReceivedEventDetail({ value: '2027-08-15' });
      await expect(datetime.locator('.datetime-selected-date')).toHaveText('Sun, Aug 15');

      await getToggle(datetime).click();

      await expect(datetime.locator('.calendar-month-year-toggle')).toHaveText(/August 2027/);
      await expect(datetime.locator('.calendar-day[data-year="2027"][data-month="8"][data-day="15"]')).toHaveClass(
        /calendar-day-active/
      );
    });

    test('should return a vertical list to the typed month', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime
          presentation="date"
          navigation-orientation="vertical"
          show-default-title="true"
          value="2022-06-03"
        ></ion-datetime>
      `,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      const datetime = page.locator('ion-datetime');

      await getToggle(datetime).click();
      await getDateField(datetime).fill('08/15/2027');
      await getToggle(datetime).click();

      await expect.poll(() => getMonthAtTop(datetime)).toBe('2027-8');
    });

    test('should keep the vertical list on its month when no date was typed', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime
          presentation="date"
          navigation-orientation="vertical"
          show-default-title="true"
          value="2022-06-03"
        ></ion-datetime>
      `,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      const datetime = page.locator('ion-datetime');

      // Scroll to a month other than the selected one, so returning to the value's month would be wrong.
      await datetime.locator('.calendar-body').evaluate((body: HTMLElement) => {
        body.scrollTop += 3 * body.querySelector<HTMLElement>('.calendar-month')!.offsetHeight;
      });
      await expect.poll(() => getMonthAtTop(datetime)).toBe('2022-9');
      await expect(datetime.locator('.calendar-month-year-announce')).toHaveText('September 2022');

      await getToggle(datetime).click();
      await getToggle(datetime).click();

      await expect.poll(() => getMonthAtTop(datetime)).toBe('2022-9');
    });

    test('should add the separators as the date is typed', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime presentation="date" show-default-title="true"></ion-datetime>
      `,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      const datetime = page.locator('ion-datetime');
      const field = getDateField(datetime);
      const ionChange = await page.spyOnEvent('ionChange');

      await getToggle(datetime).click();

      await field.pressSequentially('0815');
      await expect(field).toHaveValue('08/15/');

      await field.pressSequentially('2027');
      await expect(field).toHaveValue('08/15/2027');

      // With no value set, the date takes the current time, as tapping a day does.
      await ionChange.next();
      expect(ionChange.lastEvent?.detail.value).toMatch(/^2027-08-15T/);
    });

    test('should not put back a separator the user deletes', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime presentation="date" show-default-title="true"></ion-datetime>
      `,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      const datetime = page.locator('ion-datetime');
      const field = getDateField(datetime);

      await getToggle(datetime).click();

      await field.pressSequentially('08');
      await expect(field).toHaveValue('08/');

      await field.press('Backspace');
      await expect(field).toHaveValue('08');

      await field.pressSequentially('1');
      await expect(field).toHaveValue('08/1');
    });

    test('should drop typed separators and letters', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime presentation="date" show-default-title="true"></ion-datetime>
      `,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      const datetime = page.locator('ion-datetime');
      const field = getDateField(datetime);

      await getToggle(datetime).click();

      // The separator is already there, so typing one does not add a second.
      await field.pressSequentially('08/');
      await expect(field).toHaveValue('08/');

      await field.pressSequentially('a1');
      await expect(field).toHaveValue('08/1');
    });

    test('should stop at the length of the format', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime presentation="date" show-default-title="true"></ion-datetime>
      `,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      const datetime = page.locator('ion-datetime');
      const field = getDateField(datetime);

      await getToggle(datetime).click();
      await field.pressSequentially('0815202799');

      await expect(field).toHaveValue('08/15/2027');
    });

    test('should add the locale separators as the date is typed', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime presentation="date" show-default-title="true" locale="de-DE"></ion-datetime>
      `,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      const datetime = page.locator('ion-datetime');
      const field = getDateField(datetime);

      await getToggle(datetime).click();
      await field.pressSequentially('15082027');

      await expect(field).toHaveValue('15.08.2027');
    });

    test('should reject a date in the wrong format', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime presentation="date" show-default-title="true" value="2022-06-03"></ion-datetime>
      `,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      const datetime = page.locator('ion-datetime');
      const field = getDateField(datetime);

      await getToggle(datetime).click();
      await field.fill('8/15/27');

      // Not flagged while it could still be a date being typed.
      await expect(datetime.locator('.datetime-input ion-input')).not.toHaveClass(/ion-invalid/);

      await field.blur();

      await expect(datetime.locator('.datetime-input ion-input')).toHaveClass(/ion-invalid/);
      await expect(datetime.locator('.datetime-input .error-text')).toHaveText('Invalid format. Use: mm/dd/yyyy');
      await expect(datetime.locator('.datetime-selected-date')).toHaveText('Fri, Jun 3');
    });

    test('should reject a date outside min and max', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime
          presentation="date"
          show-default-title="true"
          value="2022-06-03"
          min="2022-03-01"
          max="2022-09-30"
        ></ion-datetime>
      `,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      const datetime = page.locator('ion-datetime');

      await getToggle(datetime).click();
      await getDateField(datetime).fill('10/01/2022');

      await expect(datetime.locator('.datetime-input .error-text')).toHaveText('Out of range: 10/01/2022');
      await expect(datetime.locator('.datetime-selected-date')).toHaveText('Fri, Jun 3');
    });

    test('should reject a date disabled by isDateEnabled', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime presentation="date" show-default-title="true" value="2022-06-03"></ion-datetime>
        <script>
          // Weekdays only.
          document.querySelector('ion-datetime').isDateEnabled = (dateString) => {
            const day = new Date(dateString + 'T00:00:00').getDay();
            return day !== 0 && day !== 6;
          };
        </script>
      `,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      const datetime = page.locator('ion-datetime');

      await getToggle(datetime).click();
      // A Saturday.
      await getDateField(datetime).fill('06/04/2022');

      await expect(datetime.locator('.datetime-input .error-text')).toHaveText('Out of range: 06/04/2022');
    });

    test('should type the date in the locale order', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime presentation="date" show-default-title="true" locale="de-DE" value="2022-06-03"></ion-datetime>
      `,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      const datetime = page.locator('ion-datetime');
      const ionChange = await page.spyOnEvent('ionChange');

      await getToggle(datetime).click();

      const field = getDateField(datetime);
      await expect(field).toHaveValue('03.06.2022');
      await expect(field).toHaveAttribute('placeholder', 'dd.mm.yyyy');

      await field.fill('15.08.2027');

      await ionChange.next();
      expect(ionChange).toHaveReceivedEventDetail({ value: '2027-08-15' });
    });

    test('should not let the date field emit events from the datetime', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime presentation="date" show-default-title="true" value="2022-06-03"></ion-datetime>
      `,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      const datetime = page.locator('ion-datetime');
      const ionChange = await page.spyOnEvent('ionChange');
      const ionInput = await page.spyOnEvent('ionInput');

      await getToggle(datetime).click();

      const field = getDateField(datetime);
      await field.fill('08/15/2027');
      await field.blur();

      await ionChange.next();

      // Only the datetime's own change, carrying its value rather than the typed text.
      expect(ionChange).toHaveReceivedEventTimes(1);
      expect(ionChange).toHaveReceivedEventDetail({ value: '2027-08-15' });
      expect(ionInput).toHaveReceivedEventTimes(0);
    });

    test('should keep the time row in input mode', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime presentation="date-time" show-default-title="true" value="2022-06-03T09:30:00"></ion-datetime>
      `,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      const datetime = page.locator('ion-datetime');
      const ionChange = await page.spyOnEvent('ionChange');

      await getToggle(datetime).click();

      await expect(datetime.locator('.datetime-time')).toBeVisible();

      await getDateField(datetime).fill('08/15/2027');

      // The typed date keeps the selected time.
      await ionChange.next();
      expect(ionChange).toHaveReceivedEventDetail({ value: '2027-08-15T09:30:00' });
    });

    test('should show the toggle with a slotted title', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime presentation="date" value="2022-06-03">
          <span slot="title">Departure</span>
        </ion-datetime>
      `,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      await expect(getToggle(page.locator('ion-datetime'))).toBeVisible();
    });

    [
      { name: 'without a header', attributes: 'presentation="date"' },
      { name: 'with multiple', attributes: 'presentation="date" show-default-title="true" multiple="true"' },
      { name: 'with preferWheel', attributes: 'presentation="date" show-default-title="true" prefer-wheel="true"' },
      { name: 'with presentation="time"', attributes: 'presentation="time" show-default-title="true"' },
    ].forEach(({ name, attributes }) => {
      test(`should not show the toggle ${name}`, async ({ page }) => {
        await page.setContent(
          `
          <ion-datetime ${attributes} value="2022-06-03T09:30:00"></ion-datetime>
        `,
          config
        );
        await page.locator('.datetime-ready').waitFor();

        await expect(getToggle(page.locator('ion-datetime'))).toHaveCount(0);
      });
    });
  });
});
