import { expect } from '@playwright/test';
import {
  configs,
  test,
} from '@utils/test/playwright';

// NOTE: these tests cannot be re-written as spec tests because the `getAccordions` method in accordion-group.tsx uses a `:scope` selector
configs({
  modes: ['md'],
  directions: ['ltr'],
}).forEach(({ config, title }) => {
  test.describe(
    title('accordion: readonly'),
    () => {
      test('should properly set readonly on child accordions', async ({
        page,
      }) => {
        await page.setContent(
          `
      <ion-accordion-group animated="false">
        <ion-accordion>
          <ion-item slot="header">Label</ion-item>
          <div slot="content">Content</div>
        </ion-accordion>
      </ion-accordion-group>
    `,
          config
        );

        const accordionGroup =
          page.locator(
            'ion-accordion-group'
          );
        const accordion = page.locator(
          'ion-accordion'
        );

        await expect(
          accordion
        ).toHaveJSProperty(
          'readonly',
          false
        );

        await accordionGroup.evaluate(
          (
            el: HTMLIonAccordionGroupElement
          ) => {
            el.readonly = true;
          }
        );

        await page.waitForChanges();

        await expect(
          accordion
        ).toHaveJSProperty(
          'readonly',
          true
        );
      });

      test('should not open accordion on click when group is readonly', async ({
        page,
      }) => {
        await page.setContent(
          `
      <ion-accordion-group animated="false" readonly>
        <ion-accordion>
          <ion-item slot="header">Label</ion-item>
          <div slot="content">Content</div>
        </ion-accordion>
      </ion-accordion-group>
    `,
          config
        );

        const accordion = page.locator(
          'ion-accordion'
        );

        await expect(
          accordion
        ).toHaveClass(
          /accordion-collapsed/
        );

        accordion.click();
        await page.waitForChanges();

        await expect(
          accordion
        ).toHaveClass(
          /accordion-collapsed/
        );
      });

      test('should not open accordion on click when accordion is readonly', async ({
        page,
      }) => {
        await page.setContent(
          `
      <ion-accordion-group animated="false">
        <ion-accordion readonly>
          <ion-item slot="header">Label</ion-item>
          <div slot="content">Content</div>
        </ion-accordion>
      </ion-accordion-group>
    `,
          config
        );

        const accordion = page.locator(
          'ion-accordion'
        );

        await expect(
          accordion
        ).toHaveClass(
          /accordion-collapsed/
        );

        accordion.click();
        await page.waitForChanges();

        await expect(
          accordion
        ).toHaveClass(
          /accordion-collapsed/
        );
      });

      test('should not open accordion via keyboard navigation when group is readonly', async ({
        page,
        browserName,
      }) => {
        await page.setContent(
          `
      <ion-accordion-group animated="false" readonly>
        <ion-accordion>
          <ion-item slot="header">Label</ion-item>
          <div slot="content">Content</div>
        </ion-accordion>
      </ion-accordion-group>
    `,
          config
        );

        const accordion = page.locator(
          'ion-accordion'
        );
        const tabKey =
          browserName === 'webkit'
            ? 'Alt+Tab'
            : 'Tab';

        await expect(
          accordion
        ).toHaveClass(
          /accordion-collapsed/
        );

        await page.keyboard.press(
          tabKey
        );
        await page.waitForChanges();

        await page.keyboard.press(
          'Enter'
        );
        await page.waitForChanges();

        await expect(
          accordion
        ).toHaveClass(
          /accordion-collapsed/
        );
      });

      test('should not open accordion via keyboard navigation when accordion is readonly', async ({
        page,
        browserName,
      }) => {
        await page.setContent(
          `
      <ion-accordion-group animated="false">
        <ion-accordion readonly>
          <ion-item slot="header">Label</ion-item>
          <div slot="content">Content</div>
        </ion-accordion>
      </ion-accordion-group>
    `,
          config
        );

        const accordion = page.locator(
          'ion-accordion'
        );
        const tabKey =
          browserName === 'webkit'
            ? 'Alt+Tab'
            : 'Tab';

        await expect(
          accordion
        ).toHaveClass(
          /accordion-collapsed/
        );

        await page.keyboard.press(
          tabKey
        );
        await page.waitForChanges();

        await page.keyboard.press(
          'Enter'
        );
        await page.waitForChanges();

        await expect(
          accordion
        ).toHaveClass(
          /accordion-collapsed/
        );
      });
    }
  );
});
