import { expect } from '@playwright/test';
import { configs, expectFieldCellsShareARow, test } from '@utils/test/playwright';

/**
 * By default ion-select takes up the full width
 * of its container. The justify property can be
 * used to change the alignment of the select
 * within the container.
 */
configs({ modes: ['ios', 'md', 'ionic-md'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('select: label'), () => {
    test.describe('select: default placement', () => {
      test('should render a space between justification with a default select', async ({ page }) => {
        await page.setContent(
          `
          <ion-select label="Label" placeholder="Select an Item"></ion-select>
         `,
          config
        );

        const select = page.locator('ion-select');
        await expect(select).toHaveScreenshot(screenshot(`select-label-default`));
      });

      test('should truncate long labels with ellipses', async ({ page }) => {
        await page.setContent(
          `
          <ion-select label="Long Label Long Label Long Label Long Label Long Label Long Label" placeholder="Select an Item"></ion-select>
         `,
          config
        );

        const select = page.locator('ion-select');
        await expect(select).toHaveScreenshot(screenshot(`select-label-long-label`));
      });
    });

    test.describe('select: stacked placement', () => {
      test('label should appear above the select when there is a value', async ({ page }) => {
        await page.setContent(
          `
           <ion-select label="Label" value="apples" label-placement="stacked">
             <ion-select-option value="apples">Apples</ion-select-option>
           </ion-select>
         `,
          config
        );

        const select = page.locator('ion-select');
        await expect(select).toHaveScreenshot(screenshot(`select-label-stacked-value`));
      });
      test('label should appear above the select when there is no value', async ({ page }) => {
        await page.setContent(
          `
           <ion-select label="Label" label-placement="stacked">
             <ion-select-option value="apples">Apples</ion-select-option>
           </ion-select>
         `,
          config
        );

        const select = page.locator('ion-select');
        await expect(select).toHaveScreenshot(screenshot(`select-label-stacked-no-value`));
      });
      test('label should appear on top of the select when the select is expanded', async ({ page }) => {
        await page.setContent(
          `
           <ion-select class="select-expanded" label="Label" label-placement="stacked" placeholder="Select a Fruit">
             <ion-select-option value="apples">Apples</ion-select-option>
           </ion-select>
         `,
          config
        );

        const select = page.locator('ion-select');

        await expect(select).toHaveScreenshot(screenshot(`select-label-stacked-expanded`));
      });
      test('long text should truncate', async ({ page }) => {
        await page.setContent(
          `
           <ion-select label="Label Label Label Label Label Label Label Label Label Label Label Label Label Label Label" label-placement="stacked" value="apples" placeholder="Select a Fruit">
             <ion-select-option value="apples">Apples Apples Apples Apples Apples Apples Apples Apples</ion-select-option>
           </ion-select>
         `,
          config
        );

        const select = page.locator('ion-select');

        await expect(select).toHaveScreenshot(screenshot(`select-label-stacked-long-text`));
      });
    });
  });
});

/**
 * By default ion-select takes up the full width
 * of its container. The justify property can be
 * used to change the alignment of the select
 * within the container.
 */
configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('select: label'), () => {
    test.describe('select: start placement', () => {
      test('should render a start justification with label in the start position', async ({ page }) => {
        await page.setContent(
          `
           <ion-select label="Label" placeholder="Select an Item" label-placement="start" justify="start"></ion-select>
         `,
          config
        );

        const select = page.locator('ion-select');
        await expect(select).toHaveScreenshot(screenshot(`select-label-start-justify-start`));
      });
      test('should render an end justification with label in the start position', async ({ page }) => {
        await page.setContent(
          `
           <ion-select label="Label" placeholder="Select an Item" label-placement="start" justify="end"></ion-select>
         `,
          config
        );

        const select = page.locator('ion-select');
        await expect(select).toHaveScreenshot(screenshot(`select-label-start-justify-end`));
      });
      test('should render a space between justification with label in the start position', async ({ page }) => {
        await page.setContent(
          `
           <ion-select label="Label" placeholder="Select an Item" label-placement="start" justify="space-between"></ion-select>
         `,
          config
        );

        const select = page.locator('ion-select');
        await expect(select).toHaveScreenshot(screenshot(`select-label-start-justify-space-between`));
      });

      test('should truncate long labels with ellipses', async ({ page }) => {
        await page.setContent(
          `
          <ion-select label="Long Label Long Label Long Label Long Label Long Label Long Label" placeholder="Select an Item" label-placement="start" justify="start"></ion-select>
         `,
          config
        );

        const select = page.locator('ion-select');
        await expect(select).toHaveScreenshot(screenshot(`select-label-start-justify-start-long-label`));
      });
    });

    test.describe('select: end placement', () => {
      test('should render a start justification with label in the end position', async ({ page }) => {
        await page.setContent(
          `
           <ion-select label="Label" placeholder="Select an Item" label-placement="end" justify="start"></ion-select>
         `,
          config
        );

        const select = page.locator('ion-select');
        await expect(select).toHaveScreenshot(screenshot(`select-label-end-justify-start`));
      });
      test('should render an end justification with label in the end position', async ({ page }) => {
        await page.setContent(
          `
           <ion-select label="Label" placeholder="Select an Item" label-placement="end" justify="end"></ion-select>
         `,
          config
        );

        const select = page.locator('ion-select');
        await expect(select).toHaveScreenshot(screenshot(`select-label-end-justify-end`));
      });
      test('should render a space between justification with label in the end position', async ({ page }) => {
        await page.setContent(
          `
           <ion-select label="Label" placeholder="Select an Item" label-placement="end" justify="space-between"></ion-select>
         `,
          config
        );

        const select = page.locator('ion-select');
        await expect(select).toHaveScreenshot(screenshot(`select-label-end-justify-space-between`));
      });
    });

    test.describe('select: fixed placement', () => {
      test('should render a start justification with label in the fixed position', async ({ page }) => {
        await page.setContent(
          `
           <ion-select label="Label" placeholder="Select an Item" label-placement="fixed" justify="start"></ion-select>
         `,
          config
        );

        const select = page.locator('ion-select');
        await expect(select).toHaveScreenshot(screenshot(`select-label-fixed-justify-start`));
      });
      test('should render an end justification with label in the fixed position', async ({ page }) => {
        await page.setContent(
          `
           <ion-select label="Label" placeholder="Select an Item" label-placement="fixed" justify="end"></ion-select>
         `,
          config
        );

        const select = page.locator('ion-select');
        await expect(select).toHaveScreenshot(screenshot(`select-label-fixed-justify-end`));
      });
      test('should render a space between justification with label in the fixed position', async ({ page }) => {
        await page.setContent(
          `
           <ion-select label="Label" placeholder="Select an Item" label-placement="fixed" justify="space-between"></ion-select>
         `,
          config
        );

        const select = page.locator('ion-select');
        await expect(select).toHaveScreenshot(screenshot(`select-label-fixed-justify-space-between`));
      });
    });

    test.describe('select: floating placement', () => {
      test('label should appear above the select when there is a value', async ({ page }) => {
        await page.setContent(
          `
           <ion-select label="Label" value="apples" label-placement="floating">
             <ion-select-option value="apples">Apples</ion-select-option>
           </ion-select>
         `,
          config
        );

        const select = page.locator('ion-select');
        await expect(select).toHaveScreenshot(screenshot(`select-label-floating-value`));
      });
      test('label should appear on top of the select when there is no value', async ({ page }) => {
        await page.setContent(
          `
           <ion-select label="Label" label-placement="floating">
             <ion-select-option value="apples">Apples</ion-select-option>
           </ion-select>
         `,
          config
        );

        const select = page.locator('ion-select');
        await expect(select).toHaveScreenshot(screenshot(`select-label-floating-no-value`));
      });
      test('label should appear on top of the select when there is a placeholder and no value', async ({ page }) => {
        await page.setContent(
          `
           <ion-select label="Label" label-placement="floating" placeholder="Placeholder">
             <ion-select-option value="apples">Apples</ion-select-option>
           </ion-select>
         `,
          config
        );

        const select = page.locator('ion-select');
        await expect(select).toHaveScreenshot(screenshot(`select-label-floating-no-value-placeholder`));
      });
      test('label should appear on top of the select when the select is expanded', async ({ page }) => {
        await page.setContent(
          `
           <ion-select class="select-expanded label-floating" label="Label" label-placement="floating" placeholder="Select a Fruit">
             <ion-select-option value="apples">Apples</ion-select-option>
           </ion-select>
         `,
          config
        );

        const select = page.locator('ion-select');

        await expect(select).toHaveScreenshot(screenshot(`select-label-floating-expanded`));
      });
      test('long text should truncate', async ({ page }) => {
        await page.setContent(
          `
           <ion-select label="Label Label Label Label Label Label Label Label Label Label Label Label Label Label Label" label-placement="floating" value="apples" placeholder="Select a Fruit">
             <ion-select-option value="apples">Apples Apples Apples Apples Apples Apples Apples Apples</ion-select-option>
           </ion-select>
         `,
          config
        );

        const select = page.locator('ion-select');

        await expect(select).toHaveScreenshot(screenshot(`select-label-floating-long-text`));
      });
    });
  });
});

configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('select: label overflow'), () => {
    test('label property should be truncated with ellipses', async ({ page }) => {
      await page.setContent(
        `
            <ion-select label="Label Label Label Label Label" placeholder="Select an Item"></ion-select>
          `,
        config
      );

      const select = page.locator('ion-select');
      await expect(select).toHaveScreenshot(screenshot(`select-label-truncate`));
    });
    test('label slot should be truncated with ellipses', async ({ page }) => {
      await page.setContent(
        `
            <ion-select placeholder="Select an Item">
              <div slot="label">Label Label Label Label Label</div>
            </ion-select>
          `,
        config
      );

      const select = page.locator('ion-select');
      await expect(select).toHaveScreenshot(screenshot(`select-label-slot-truncate`));
    });

    /**
     * The floating label must be positioned relative to `.select-wrapper` so its
     * width is not constrained when the select width collapses. These tests
     * cover both cases: a long label should retain the same available width
     * despite wide start content, and a short label should not collapse when
     * the start content takes up most of the select's width.
     */
    test('start slot content should not shrink the label', async ({ page }) => {
      await page.setContent(
        `
        <div style="width: 200px">
          <ion-select id="plain" fill="outline" label-placement="floating" value="1" label="Email Email Email Email Email Email">
            <ion-select-option value="1">One</ion-select-option>
          </ion-select>
          <ion-select id="wide-start" fill="outline" label-placement="floating" value="1" label="Email Email Email Email Email Email">
            <div slot="start" style="width: 120px; height: 24px"></div>
            <ion-select-option value="1">One</ion-select-option>
          </ion-select>
        </div>
      `,
        config
      );

      const labelWidth = (id: string) =>
        page.locator(`${id} .label-text`).evaluate((el: HTMLElement) => ({
          available: el.clientWidth,
          wanted: el.scrollWidth,
        }));

      const plain = await labelWidth('#plain');
      const wideStart = await labelWidth('#wide-start');

      // The label is long enough that it has to truncate in both cases
      expect(plain.wanted).toBeGreaterThan(plain.available);

      expect(wideStart.available).toBe(plain.available);
    });

    test('start slot content should not collapse a short label', async ({ page }) => {
      await page.setContent(
        `
        <div style="width: 200px">
          <ion-select fill="outline" label-placement="floating" value="1" label="Email">
            <div slot="start" style="width: 170px; height: 24px"></div>
            <ion-select-option value="1">One</ion-select-option>
          </ion-select>
        </div>
      `,
        config
      );

      const label = await page.locator('.label-text').evaluate((el: HTMLElement) => ({
        available: el.clientWidth,
        wanted: el.scrollWidth,
      }));

      expect(label.available).toBe(label.wanted);
    });
  });
});
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('select: alert label'), () => {
    test('should use the label prop to set the default header in an alert', async ({ page }) => {
      await page.setContent(
        `
         <ion-select label="My Alert" interface="alert">
           <ion-select-option value="a">A</ion-select-option>
         </ion-select>
       `,
        config
      );

      const select = page.locator('ion-select');
      const alert = page.locator('ion-alert');
      const ionAlertDidPresent = await page.spyOnEvent('ionAlertDidPresent');

      await select.click();
      await ionAlertDidPresent.next();

      await expect(alert.locator('.alert-title')).toHaveText('My Alert');
    });
    test('should use the label slot to set the default header in an alert', async ({ page }) => {
      await page.setContent(
        `
         <ion-select interface="alert">
            <div slot="label">My Alert</div>
           <ion-select-option value="a">A</ion-select-option>
         </ion-select>
       `,
        config
      );

      const select = page.locator('ion-select');
      const alert = page.locator('ion-alert');
      const ionAlertDidPresent = await page.spyOnEvent('ionAlertDidPresent');

      await select.click();
      await ionAlertDidPresent.next();

      await expect(alert.locator('.alert-title')).toHaveText('My Alert');
    });
    test('should use the label prop to set the default header in an alert if both prop and slot are set', async ({
      page,
    }) => {
      await page.setContent(
        `
         <ion-select label="My Prop Alert" interface="alert">
            <div slot="label">My Slot Alert</div>
           <ion-select-option value="a">A</ion-select-option>
         </ion-select>
       `,
        config
      );

      const select = page.locator('ion-select');
      const alert = page.locator('ion-alert');
      const ionAlertDidPresent = await page.spyOnEvent('ionAlertDidPresent');

      await select.click();
      await ionAlertDidPresent.next();

      await expect(alert.locator('.alert-title')).toHaveText('My Prop Alert');
    });
  });
});

/**
 * This behavior does not vary across modes/directions
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('select: floating label focus'), () => {
    test('label should appear on top of the select when it is focused, has a placeholder, and no value', async ({
      page,
    }) => {
      await page.setContent(
        `
           <ion-select label="Label" label-placement="floating" placeholder="Placeholder">
             <ion-select-option value="apples">Apples</ion-select-option>
           </ion-select>
         `,
        config
      );

      const select = page.locator('ion-select');
      await page.locator('ion-select button').focus();
      await expect(select).toHaveScreenshot(screenshot(`select-label-floating-focus-no-value-placeholder`));
    });
  });
});

/**
 * The label placement does not vary by mode, so `ionic-md` stands in for both.
 * These comparisons are along the inline axis, which would need inverting under
 * rtl.
 */
configs({ modes: ['ionic-md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('select: label'), () => {
    for (const placement of ['start', 'fixed'] as const) {
      test(`label should sit before the field with a ${placement} placement`, async ({ page }) => {
        await page.setContent(
          `<ion-select label="Fruit" label-placement="${placement}" value="apple"><ion-select-option value="apple">Apple</ion-select-option></ion-select>`,
          config
        );

        const host = page.locator('ion-select');
        const label = await host.locator('.label-text-wrapper').boundingBox();
        const native = await host.locator('.native-wrapper').boundingBox();

        expect(label).not.toBeNull();
        expect(native).not.toBeNull();

        // The two share the row.
        expect(label!.y).toBeLessThan(native!.y + native!.height);
        expect(native!.y).toBeLessThan(label!.y + label!.height);

        expect(label!.x + label!.width).toBeLessThanOrEqual(native!.x);

        await expectFieldCellsShareARow(host, 'select');
      });
    }

    test('label should sit after the field with an end placement', async ({ page }) => {
      await page.setContent(
        `<ion-select label="Fruit" label-placement="end" value="apple"><ion-select-option value="apple">Apple</ion-select-option></ion-select>`,
        config
      );

      const host = page.locator('ion-select');
      const label = await host.locator('.label-text-wrapper').boundingBox();
      const native = await host.locator('.native-wrapper').boundingBox();

      expect(label!.y).toBeLessThan(native!.y + native!.height);
      expect(native!.y).toBeLessThan(label!.y + label!.height);

      expect(label!.x).toBeGreaterThanOrEqual(native!.x + native!.width);

      await expectFieldCellsShareARow(host, 'select');
    });

    test('field should sit at the start when there is no label', async ({ page }) => {
      await page.setContent(
        `<ion-select placeholder="Fruit"><ion-select-option value="apple">Apple</ion-select-option></ion-select>`,
        config
      );

      const select = page.locator('ion-select');
      const wrapper = await select.locator('.select-wrapper').boundingBox();
      const start = await select.locator('.select-start').boundingBox();

      // A hidden label collapses its own track, but the free space that
      // separates it from the field has to collapse too.
      expect(start!.x).toBeLessThan(wrapper!.x + wrapper!.width / 2);

      await expectFieldCellsShareARow(select, 'select');
    });

    /**
     * The no-label rule and the justify rules land on the same element with the
     * same specificity, so the cascade resolves them per declaration. That is
     * why `end` restates every track, while `space-between` is gated on the
     * label so it defers instead.
     */
    test('justify end should place the field at the end when there is no label', async ({ page }) => {
      await page.setContent(
        `<ion-select placeholder="Fruit" justify="end"><ion-select-option value="apple">Apple</ion-select-option></ion-select>`,
        config
      );

      const select = page.locator('ion-select');
      const host = await select.boundingBox();
      const end = await select.locator('.select-end').boundingBox();

      // Flush with the end edge.
      expect(end!.x + end!.width).toBeCloseTo(host!.x + host!.width, 0);
    });

    /**
     * With no label there is nothing to space the field away from, so the free
     * space belongs after it. This matches the flex layout these placements had
     * before, where `space-between` with a single in-flow item behaved as start.
     */
    for (const justify of ['start', 'space-between'] as const) {
      test(`justify ${justify} should place the field at the start when there is no label`, async ({ page }) => {
        await page.setContent(
          `<ion-select placeholder="Fruit" justify="${justify}"><ion-select-option value="apple">Apple</ion-select-option></ion-select>`,
          config
        );

        const select = page.locator('ion-select');
        const host = await select.boundingBox();
        const start = await select.locator('.select-start').boundingBox();

        expect(start!.x).toBeCloseTo(host!.x, 0);
      });
    }

    for (const placement of ['stacked', 'floating'] as const) {
      test(`label should sit above the field with a ${placement} placement`, async ({ page }) => {
        await page.setContent(
          `<ion-select label="Fruit" label-placement="${placement}" value="apple"><ion-select-option value="apple">Apple</ion-select-option></ion-select>`,
          config
        );

        const host = page.locator('ion-select');
        const label = await host.locator('.label-text-wrapper').boundingBox();
        const native = await host.locator('.native-wrapper').boundingBox();

        expect(label).not.toBeNull();
        expect(native).not.toBeNull();

        // Above, in its own row. The rows are adjacent with no gap, so this
        // edge is meant to be equal and gets a pixel of slack.
        expect(label!.y + label!.height).toBeLessThan(native!.y + 1);

        // Starts at the field's inline edge.
        expect(label!.x).toBeLessThanOrEqual(native!.x);

        await expectFieldCellsShareARow(host, 'select');
      });
    }
  });
});
